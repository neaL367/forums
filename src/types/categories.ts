import { Forums } from "@/types/forum";

export type Categories = {
  createdAt: Date;
  updatedAt: Date;
    
  id: string
  title: string
  description: string
  
  forums: Forums[]
}