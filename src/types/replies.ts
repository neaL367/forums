export type Replies = {
  createdAt: Date;
  updatedAt: Date;

  id: string;
  topicId: string;
  
  parentRepliesId?: string;
    
  content: string;
}