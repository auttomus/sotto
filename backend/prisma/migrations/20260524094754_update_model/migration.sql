/*
  Warnings:

  - You are about to drop the column `major` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `conversations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_order_id_fkey";

-- DropIndex
DROP INDEX "conversations_order_id_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "major",
ADD COLUMN     "major_id" UUID;

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "order_id";

-- CreateTable
CREATE TABLE "majors" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "school_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "majors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "majors_school_id_name_key" ON "majors"("school_id", "name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "majors" ADD CONSTRAINT "majors_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
