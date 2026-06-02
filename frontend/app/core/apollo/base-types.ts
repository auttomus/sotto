/* eslint-disable */
// @ts-nocheck

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
};

export type AccountModel = {
  __typename?: 'AccountModel';
  avatarObjectKey?: Maybe<Scalars['String']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bannerObjectKey?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  followersCount: Scalars['String']['output'];
  followingCount: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isFollowing?: Maybe<Scalars['Boolean']['output']>;
  major?: Maybe<Scalars['String']['output']>;
  majorId?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  schoolId?: Maybe<Scalars['String']['output']>;
  schoolName?: Maybe<Scalars['String']['output']>;
  trustScore: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type AccountPartial = {
  __typename?: 'AccountPartial';
  avatarObjectKey?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  major?: Maybe<Scalars['String']['output']>;
  trustScore: Scalars['Float']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type ConversationModel = {
  __typename?: 'ConversationModel';
  activeOrder?: Maybe<OrderModel>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  lastMessageContent?: Maybe<Scalars['String']['output']>;
  participants?: Maybe<Array<ConversationParticipant>>;
  type: ConversationType;
  unreadCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ConversationParticipant = {
  __typename?: 'ConversationParticipant';
  accountId: Scalars['ID']['output'];
  avatarObjectKey?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  lastReadMessageId?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export enum ConversationType {
  Direct = 'DIRECT',
  Group = 'GROUP',
  Order = 'ORDER'
}

export type CreateConversationInput = {
  participantIds: Array<Scalars['ID']['input']>;
  type?: Scalars['String']['input'];
};

export type CreateListingInput = {
  basePrice: Scalars['Float']['input'];
  deliveryTimeDays?: InputMaybe<Scalars['Int']['input']>;
  description: Scalars['String']['input'];
  digitalFileObjectKey?: InputMaybe<Scalars['String']['input']>;
  digitalLink?: InputMaybe<Scalars['String']['input']>;
  isUnlimited?: InputMaybe<Scalars['Boolean']['input']>;
  maxActiveOrders?: InputMaybe<Scalars['Int']['input']>;
  mediaIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  title: Scalars['String']['input'];
  type?: Scalars['String']['input'];
};

export type CreateOfferInput = {
  buyerAccountId: Scalars['ID']['input'];
  conversationId: Scalars['ID']['input'];
  deliveryTimeDays: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  listingId?: InputMaybe<Scalars['ID']['input']>;
  proposedPrice: Scalars['Float']['input'];
};

export type CreateOrderInput = {
  agreedPrice: Scalars['Float']['input'];
  customOfferId?: InputMaybe<Scalars['ID']['input']>;
  listingId: Scalars['ID']['input'];
};

export type CreatePostInput = {
  content: Scalars['String']['input'];
  inReplyToPostId?: InputMaybe<Scalars['ID']['input']>;
  linkedServiceId?: InputMaybe<Scalars['ID']['input']>;
  mediaIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type CustomOfferModel = {
  __typename?: 'CustomOfferModel';
  buyerAccountId: Scalars['String']['output'];
  conversationId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deliveryTimeDays: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  listingId?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['String']['output']>;
  proposedPrice: Scalars['Float']['output'];
  sellerAccountId: Scalars['String']['output'];
  status: OfferStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type ListingModel = {
  __typename?: 'ListingModel';
  account?: Maybe<AccountPartial>;
  accountId: Scalars['ID']['output'];
  averageRating: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  deliveryTimeDays?: Maybe<Scalars['Int']['output']>;
  description: Scalars['String']['output'];
  digitalFileObjectKey?: Maybe<Scalars['String']['output']>;
  digitalLink?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isLikedByMe: Scalars['Boolean']['output'];
  isUnlimited: Scalars['Boolean']['output'];
  likesCount: Scalars['Int']['output'];
  maxActiveOrders?: Maybe<Scalars['Int']['output']>;
  media?: Maybe<Array<MediaAttachmentModel>>;
  price: Scalars['Float']['output'];
  reviews?: Maybe<Array<ReviewModel>>;
  reviewsCount: Scalars['Int']['output'];
  status: ListingStatus;
  title: Scalars['String']['output'];
  type: ListingType;
  updatedAt: Scalars['DateTime']['output'];
};

export enum ListingStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Paused = 'PAUSED'
}

export enum ListingType {
  DigitalProduct = 'DIGITAL_PRODUCT',
  Service = 'SERVICE'
}

export type MajorModel = {
  __typename?: 'MajorModel';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  schoolId: Scalars['ID']['output'];
};

export type MediaAttachmentModel = {
  __typename?: 'MediaAttachmentModel';
  attachedId: Scalars['String']['output'];
  attachedType: Scalars['String']['output'];
  blurhash?: Maybe<Scalars['String']['output']>;
  bucketName: Scalars['String']['output'];
  contentType: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isPrivate: Scalars['Boolean']['output'];
  objectKey: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type MessageModel = {
  __typename?: 'MessageModel';
  content: Scalars['String']['output'];
  conversationId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  editedAt?: Maybe<Scalars['DateTime']['output']>;
  media?: Maybe<Array<MediaAttachmentModel>>;
  messageId: Scalars['String']['output'];
  senderAvatarObjectKey?: Maybe<Scalars['String']['output']>;
  senderDisplayName?: Maybe<Scalars['String']['output']>;
  senderId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptOffer: CustomOfferModel;
  acceptSplitRefund: OrderModel;
  advanceOrderStatus: OrderModel;
  cancelOrder: OrderModel;
  confirmUpload: MediaAttachmentModel;
  createConversation: ConversationModel;
  createListing: ListingModel;
  createOffer: CustomOfferModel;
  createOrder: OrderModel;
  createPost: PostModel;
  createReview: ReviewModel;
  createTag: TagModel;
  deleteListing: Scalars['Boolean']['output'];
  deleteMedia: Scalars['Boolean']['output'];
  deleteMessage: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  fileComplaint: OrderModel;
  follow: Scalars['Boolean']['output'];
  getMidtransSnapToken: Scalars['String']['output'];
  markAllNotificationsAsRead: Scalars['Boolean']['output'];
  markConversationAsRead: Scalars['Boolean']['output'];
  markNotificationAsRead: Scalars['Boolean']['output'];
  proposeSplitRefund: OrderModel;
  refundDisputedOrder: OrderModel;
  rejectOffer: CustomOfferModel;
  rejectSplitRefund: OrderModel;
  requestUploadUrl: PresignedUploadResult;
  toggleLikeListing: Scalars['Boolean']['output'];
  toggleLikePost: Scalars['Boolean']['output'];
  /** Catat interaksi user (view, click, like) */
  trackEvent: Scalars['Boolean']['output'];
  unfollow: Scalars['Boolean']['output'];
  updateListing: ListingModel;
  updateMessage: MessageModel;
  updatePost: PostModel;
  updateProfile: AccountModel;
  verifyPayment: Scalars['String']['output'];
  withdrawOffer: CustomOfferModel;
};


export type MutationAcceptOfferArgs = {
  offerId: Scalars['ID']['input'];
};


export type MutationAcceptSplitRefundArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationAdvanceOrderStatusArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationCancelOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationConfirmUploadArgs = {
  input: RequestUploadInput;
  objectKey: Scalars['String']['input'];
};


export type MutationCreateConversationArgs = {
  input: CreateConversationInput;
};


export type MutationCreateListingArgs = {
  input: CreateListingInput;
};


export type MutationCreateOfferArgs = {
  input: CreateOfferInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateReviewArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['ID']['input'];
  rating: Scalars['Float']['input'];
};


export type MutationCreateTagArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteListingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMediaArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMessageArgs = {
  conversationId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationFileComplaintArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationFollowArgs = {
  targetAccountId: Scalars['ID']['input'];
};


export type MutationGetMidtransSnapTokenArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationMarkConversationAsReadArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationProposeSplitRefundArgs = {
  buyerAmount: Scalars['Float']['input'];
  orderId: Scalars['ID']['input'];
  sellerAmount: Scalars['Float']['input'];
};


export type MutationRefundDisputedOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationRejectOfferArgs = {
  offerId: Scalars['ID']['input'];
};


export type MutationRejectSplitRefundArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationRequestUploadUrlArgs = {
  input: RequestUploadInput;
};


export type MutationToggleLikeListingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationToggleLikePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationTrackEventArgs = {
  actionType: Scalars['String']['input'];
  targetId: Scalars['String']['input'];
};


export type MutationUnfollowArgs = {
  targetAccountId: Scalars['ID']['input'];
};


export type MutationUpdateListingArgs = {
  id: Scalars['ID']['input'];
  input: UpdateListingInput;
};


export type MutationUpdateMessageArgs = {
  conversationId: Scalars['ID']['input'];
  input: UpdateMessageInput;
  messageId: Scalars['ID']['input'];
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
  postId: Scalars['String']['input'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationVerifyPaymentArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationWithdrawOfferArgs = {
  offerId: Scalars['ID']['input'];
};

export type NotificationModel = {
  __typename?: 'NotificationModel';
  accountId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  fromAccountId?: Maybe<Scalars['String']['output']>;
  /** Resolved: display name of the triggering account */
  fromDisplayName?: Maybe<Scalars['String']['output']>;
  /** Resolved: username of the triggering account */
  fromUsername?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  targetId?: Maybe<Scalars['String']['output']>;
  targetType?: Maybe<Scalars['String']['output']>;
  type: NotificationType;
};

export enum NotificationType {
  Follow = 'FOLLOW',
  Mention = 'MENTION',
  NewMessage = 'NEW_MESSAGE',
  OrderUpdate = 'ORDER_UPDATE'
}

export enum OfferStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Withdrawn = 'WITHDRAWN'
}

export type OrderModel = {
  __typename?: 'OrderModel';
  agreedPrice: Scalars['Float']['output'];
  buyer?: Maybe<AccountModel>;
  buyerAccountId: Scalars['String']['output'];
  complaintNotes?: Maybe<Scalars['String']['output']>;
  complaintReason?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customOfferId?: Maybe<Scalars['String']['output']>;
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  disputedAt?: Maybe<Scalars['DateTime']['output']>;
  disputedById?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isReviewable: Scalars['Boolean']['output'];
  listingId: Scalars['String']['output'];
  lockVersion: Scalars['Int']['output'];
  proposedSplitBuyerAmount?: Maybe<Scalars['Float']['output']>;
  proposedSplitById?: Maybe<Scalars['String']['output']>;
  proposedSplitSellerAmount?: Maybe<Scalars['Float']['output']>;
  review?: Maybe<ReviewModel>;
  seller?: Maybe<AccountModel>;
  sellerAccountId: Scalars['String']['output'];
  status: OrderStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Delivered = 'DELIVERED',
  Disputed = 'DISPUTED',
  InProgress = 'IN_PROGRESS',
  PendingPayment = 'PENDING_PAYMENT'
}

export type PostModel = {
  __typename?: 'PostModel';
  ancestors?: Maybe<Array<PostModel>>;
  authorAvatarObjectKey?: Maybe<Scalars['String']['output']>;
  authorDisplayName?: Maybe<Scalars['String']['output']>;
  authorId: Scalars['String']['output'];
  authorSchoolName?: Maybe<Scalars['String']['output']>;
  authorUsername?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  editedAt?: Maybe<Scalars['DateTime']['output']>;
  inReplyToPostId?: Maybe<Scalars['String']['output']>;
  likedByMe: Scalars['Boolean']['output'];
  likesCount: Scalars['Int']['output'];
  linkedServiceId?: Maybe<Scalars['String']['output']>;
  media?: Maybe<Array<MediaAttachmentModel>>;
  postId: Scalars['ID']['output'];
  repliesCount: Scalars['Int']['output'];
  tags?: Maybe<Array<TagModel>>;
};

export type PresignedUploadResult = {
  __typename?: 'PresignedUploadResult';
  objectKey: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  conversations: Array<ConversationModel>;
  feed: Array<PostModel>;
  followers: Array<AccountModel>;
  following: Array<AccountModel>;
  globalFeed: Array<PostModel>;
  likedListings: Array<ListingModel>;
  likedPosts: Array<PostModel>;
  listing?: Maybe<ListingModel>;
  listings: Array<ListingModel>;
  listingsByAccount: Array<ListingModel>;
  majorsBySchool: Array<MajorModel>;
  mediaForObject: Array<MediaAttachmentModel>;
  messages: Array<MessageModel>;
  myOrders: Array<OrderModel>;
  myProfile: AccountModel;
  notifications: Array<NotificationModel>;
  offersForConversation: Array<CustomOfferModel>;
  order?: Maybe<OrderModel>;
  post?: Maybe<PostModel>;
  postsByAccount: Array<PostModel>;
  profile?: Maybe<AccountModel>;
  replies: Array<PostModel>;
  repliesByAccount: Array<PostModel>;
  school?: Maybe<SchoolModel>;
  schools: Array<SchoolModel>;
  searchAccounts: Array<AccountModel>;
  searchListings: Array<ListingModel>;
  searchPosts: Array<PostModel>;
  searchSchools: Array<SchoolModel>;
  searchTags: Array<TagModel>;
  tags: Array<TagModel>;
  unreadChatCount: Scalars['Int']['output'];
  unreadNotificationCount: Scalars['Int']['output'];
};


export type QueryFeedArgs = {
  limit?: Scalars['Int']['input'];
};


export type QueryFollowersArgs = {
  accountId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFollowingArgs = {
  accountId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGlobalFeedArgs = {
  limit?: Scalars['Int']['input'];
};


export type QueryListingArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListingsByAccountArgs = {
  accountId: Scalars['ID']['input'];
};


export type QueryMajorsBySchoolArgs = {
  schoolId: Scalars['ID']['input'];
};


export type QueryMediaForObjectArgs = {
  attachedId: Scalars['String']['input'];
  attachedType: Scalars['String']['input'];
};


export type QueryMessagesArgs = {
  conversationId: Scalars['ID']['input'];
  limit?: Scalars['Int']['input'];
};


export type QueryMyOrdersArgs = {
  role: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNotificationsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOffersForConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type QueryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostArgs = {
  postId: Scalars['String']['input'];
};


export type QueryPostsByAccountArgs = {
  accountId: Scalars['String']['input'];
};


export type QueryProfileArgs = {
  username: Scalars['String']['input'];
};


export type QueryRepliesArgs = {
  postId: Scalars['String']['input'];
};


export type QueryRepliesByAccountArgs = {
  accountId: Scalars['String']['input'];
};


export type QuerySchoolArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchAccountsArgs = {
  query: Scalars['String']['input'];
};


export type QuerySearchListingsArgs = {
  query: Scalars['String']['input'];
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type QuerySearchPostsArgs = {
  query: Scalars['String']['input'];
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type QuerySearchSchoolsArgs = {
  query: Scalars['String']['input'];
};


export type QuerySearchTagsArgs = {
  query: Scalars['String']['input'];
};

export type RequestUploadInput = {
  attachedId?: InputMaybe<Scalars['String']['input']>;
  attachedType: Scalars['String']['input'];
  contentType: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  isPrivate?: Scalars['Boolean']['input'];
};

export type ReviewModel = {
  __typename?: 'ReviewModel';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  orderId: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  reviewer?: Maybe<AccountModel>;
  reviewerAccountId: Scalars['String']['output'];
  targetAccountId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SchoolModel = {
  __typename?: 'SchoolModel';
  city?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  domain?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isVerified: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  npsn: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TagModel = {
  __typename?: 'TagModel';
  id: Scalars['ID']['output'];
  isUsable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type UpdateListingInput = {
  basePrice?: InputMaybe<Scalars['Float']['input']>;
  deliveryTimeDays?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  digitalFileObjectKey?: InputMaybe<Scalars['String']['input']>;
  digitalLink?: InputMaybe<Scalars['String']['input']>;
  isUnlimited?: InputMaybe<Scalars['Boolean']['input']>;
  maxActiveOrders?: InputMaybe<Scalars['Int']['input']>;
  mediaIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMessageInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  mediaIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdatePostInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  mediaIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateProfileInput = {
  avatarObjectKey?: InputMaybe<Scalars['String']['input']>;
  bannerObjectKey?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};
