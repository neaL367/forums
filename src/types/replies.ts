export type Replies = {
  createdAt: Date;
  updatedAt: Date;

  id: string;
  topicId: string;
  topicTitle: string;

  parentReplyId?: string;
  parentReplyContent: string;

  content: string;
}
