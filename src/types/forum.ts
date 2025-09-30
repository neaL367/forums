import { Topic } from "@/types/topic";

export type Forum = {
  createdAt: Date;
  updatedAt: Date;

  id: string
  title: string
  description: string

  parentForumId?: string;
  parentForumTitle?: string;

  topics?: Topic[];
  subForums?: Forum[];

  depth: number;
}