import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, types, mapping } from 'cassandra-driver';

@Injectable()
export class ScyllaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScyllaService.name);
  private client: Client;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const contactPoints = this.config
      .get<string>('SCYLLA_CONTACT_POINTS', 'localhost:9042')
      .split(',');
    const keyspace = this.config.get<string>('SCYLLA_KEYSPACE', 'sotto');
    const datacenter = this.config.get<string>(
      'SCYLLA_DATACENTER',
      'datacenter1',
    );

    // Koneksi awal tanpa keyspace untuk bisa membuat keyspace
    this.client = new Client({
      contactPoints,
      localDataCenter: datacenter,
      protocolOptions: { port: 9042 },
    });

    await this.client.connect();
    this.logger.log('Terhubung ke ScyllaDB');

    // Buat keyspace jika belum ada
    await this.client.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${keyspace}
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
    `);

    // Reconnect dengan keyspace
    await this.client.shutdown();
    this.client = new Client({
      contactPoints,
      localDataCenter: datacenter,
      keyspace,
      protocolOptions: { port: 9042 },
    });
    await this.client.connect();
    this.logger.log(`Keyspace "${keyspace}" aktif`);

    // Buat tabel sesuai NoSQL schema
    await this.ensureTables();
  }

  async onModuleDestroy() {
    await this.client?.shutdown();
  }

  /** Akses langsung ke cassandra-driver Client */
  getClient(): Client {
    return this.client;
  }

  /** Eksekusi CQL query */
  async execute(
    query: string,
    params?: unknown[],
    options?: { prepare?: boolean },
  ) {
    return this.client.execute(query, params, {
      prepare: options?.prepare ?? true,
    });
  }

  /** Eksekusi batch queries */
  async batch(
    queries: Array<{ query: string; params?: unknown[] }>,
  ) {
    return this.client.batch(queries, { prepare: true });
  }

  // ── Schema Migration ───────────────────────────────────

  private async ensureTables() {
    const tables = [
      // Tabel posts (Karya & Showcase)
      `CREATE TABLE IF NOT EXISTS posts (
        post_id timeuuid,
        author_id bigint,
        in_reply_to_post_id timeuuid,
        content text,
        linked_service_id bigint,
        created_at timestamp,
        PRIMARY KEY (post_id)
      )`,

      // Tabel messages (Chat payload)
      `CREATE TABLE IF NOT EXISTS messages (
        conversation_id bigint,
        message_id timeuuid,
        sender_id bigint,
        content text,
        created_at timestamp,
        PRIMARY KEY (conversation_id, message_id)
      ) WITH CLUSTERING ORDER BY (message_id DESC)`,

      // Tabel user_feeds (Fan-out timeline)
      `CREATE TABLE IF NOT EXISTS user_feeds (
        user_id bigint,
        post_id timeuuid,
        author_id bigint,
        created_at timestamp,
        PRIMARY KEY (user_id, post_id)
      ) WITH CLUSTERING ORDER BY (post_id DESC)`,

      // Tabel interaction_logs (Bahan baku Synergy Engine)
      `CREATE TABLE IF NOT EXISTS interaction_logs (
        user_id bigint,
        interaction_time timestamp,
        action_type text,
        target_id text,
        PRIMARY KEY (user_id, interaction_time)
      ) WITH CLUSTERING ORDER BY (interaction_time DESC)`,
    ];

    for (const ddl of tables) {
      await this.client.execute(ddl);
    }
    this.logger.log('ScyllaDB tabel siap');
  }
}
