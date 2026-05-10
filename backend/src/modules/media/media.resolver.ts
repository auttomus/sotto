import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { MediaService } from './media.service';
import {
  MediaAttachmentModel,
  PresignedUploadResult,
} from './models/media-attachment.model';
import { RequestUploadInput } from './dto/request-upload.input';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Resolver(() => MediaAttachmentModel)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) { }

  @Mutation(() => PresignedUploadResult)
  async requestUploadUrl(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: RequestUploadInput,
  ) {
    return this.mediaService.requestUploadUrl(user.accountId, input);
  }

  @Mutation(() => MediaAttachmentModel)
  async confirmUpload(
    @CurrentUser() user: CurrentUserPayload,
    @Args('objectKey') objectKey: string,
    @Args('input') input: RequestUploadInput,
  ) {
    const media = await this.mediaService.confirmUpload(
      user.accountId,
      objectKey,
      input,
    );
    return { ...media, id: media.id.toString(), fileSize: media.fileSize.toString() };
  }

  @Query(() => [MediaAttachmentModel], { name: 'mediaForObject' })
  async getMediaForObject(
    @Args('attachedType') attachedType: string,
    @Args('attachedId') attachedId: string,
  ) {
    return this.mediaService.getMediaForObject(attachedType, attachedId);
  }

  @Mutation(() => Boolean)
  async deleteMedia(
    @CurrentUser() user: CurrentUserPayload,
    @Args('id', { type: () => ID }) id: string,
  ) {
    await this.mediaService.deleteMedia(BigInt(id), user.accountId);
    return true;
  }
}
