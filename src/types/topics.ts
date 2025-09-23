import { Replies } from "@/types/replies";

export type Topics = {
  createdAt: Date;
  updatedAt: Date;
  
  id: string
  title: string

  forumId: string;
  forumTitle: string;
  replies?: Replies[];
}