export type Roles = "MEMBERS" | "ADMINISTRATOR" | "MODERATOR" | "OWNER" | "STAFF" | "GUEST";

export type User = {
    createdAt: Date;
    updatedAt: Date;
    joinDate: Date;
    lastActive: Date;

    id: string;
    name: string;
    username: string;
    displayUsername: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: Roles;
    bio: string | null;
    website: string | null;
    location: string | null;
    postCount: number;
    reputation: number;
    
    isBanned: boolean;
    banReson: string | null;
    banExpiresAt: Date | null;
};

export type UserProfile = {
    createdAt: Date;
    updatedAt: Date;
    joinDate: Date;
    lastActive: Date;

    id: string;
    image: string | null;
    displayUsername: string;
    role: Roles;

    bio: string | null;
    website: string | null;
    location: string | null;
    postCount: number;
    reputation: number;
};