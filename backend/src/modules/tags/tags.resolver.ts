import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { TagModel } from './models/tag.model';
import { Public } from '../../common/decorators/public.decorator';

@Resolver(() => TagModel)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Query(() => [TagModel], { name: 'searchTags' })
  async searchTags(@Args('query') query: string) {
    const tags = await this.tagsService.searchTags(query);
    return tags.map((t) => ({ ...t, id: t.id.toString() }));
  }

  @Public()
  @Query(() => [TagModel], { name: 'tags' })
  async getAllTags() {
    const tags = await this.tagsService.getAllTags();
    return tags.map((t) => ({ ...t, id: t.id.toString() }));
  }

  @Mutation(() => TagModel)
  async createTag(@Args('name') name: string) {
    const tag = await this.tagsService.createTag(name);
    return { ...tag, id: tag.id.toString() };
  }
}
