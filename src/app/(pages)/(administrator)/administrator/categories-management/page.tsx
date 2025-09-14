import { CategoriesDataTable } from "@/features/administrator/categories/categories-data-table-client";
import { categoriesColumns } from "@/features/administrator/categories/data/columns";
import type { Categories } from "@/types/categories";

const mockCategories: Categories[] = [
  {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "1",
    title: "Grand Theft Auto",
    description: "Description 1",
    forums: [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: "1",
        title: "GTAVI",
        description: "Grand Theft Auto VI",
        categoryId: "1",
        parentForumsId: "",

        topics: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: "1",
            title: "Topic 1",
            forumId: "1",
            replies: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                id: "1",
                topicId: "1",
                parentRepliesId: "",
                content: "Reply 1",
              },
            ],
          },
        ],
        subForums: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: "2",
            title: "Sub Forum 1",
            description: "Description 1",
            categoryId: "1",
            parentForumsId: "1",

            topics: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                id: "2",
                title: "Topic 2",
                forumId: "2",
                replies: [],
              },
            ],
            subForums: [],
          },
        ],
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: "2",
        title: "GTAV",
        description: "Grand Theft Auto V",
        categoryId: "1",
        parentForumsId: "",

        topics: [],
      },
    ],
  },
  {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "2",
    title: "Red Dead Redemption",
    description: "Description 1",
    forums: [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: "1",
        title: "Red Dead Redemption",
        description: "Red Dead Redemption",
        categoryId: "1",
        parentForumsId: "",

        topics: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: "1",
            title: "Topic 1",
            forumId: "1",
            replies: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                id: "1",
                topicId: "1",
                parentRepliesId: "",
                content: "Reply 1",
              },
            ],
          },
        ],
        subForums: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: "2",
            title: "Sub Forum 1",
            description: "Description 1",
            categoryId: "1",
            parentForumsId: "1",

            topics: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                id: "2",
                title: "Topic 2",
                forumId: "2",
                replies: [],
              },
            ],
            subForums: [],
          },
        ],
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: "2",
        title: "Red Dead Redemption 2",
        description: "Red Dead Redemption 2",
        categoryId: "1",
        parentForumsId: "",

        topics: [],
      },
    ],
  },
];

export default async function CategoriesPage() {
  return (
    <div className=" mx-auto p-6">
      <CategoriesTable />
    </div>
  );
}

async function CategoriesTable() {
  return (
    <CategoriesDataTable columns={categoriesColumns} data={mockCategories} />
  );
}
