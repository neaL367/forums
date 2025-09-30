import { Reply } from "@/types/reply";

export type Topic = {
  createdAt: Date;
  updatedAt: Date;
  
  id: string
  title: string

  forumId: string;
  forumTitle: string;
  replies?: Reply[];
}