export type User = {
    id: string;
    name: string;
    username: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    displayUsername: string;
    role:  "MEMBERS" | "ADMINISTRATOR" | "MODERATOR" | "OWNER" | "STAFF" | "GUEST";
};