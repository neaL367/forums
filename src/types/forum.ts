import { Topics } from "@/types/topics";

export type Forums = {
  createdAt: Date;
  updatedAt: Date;

  id: string
  title: string
  description: string
  categoryId: string;
  parentForumsId?: string;
  
  topics?: Topics[];
  subForums?: Forums[];
}