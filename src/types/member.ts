export type Roles = "MEMBERS" | "ADMINISTRATOR" | "MODERATOR" | "OWNER" | "STAFF" | "GUEST";

export type Members = {
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
    
    banned: boolean;
    banExpires: Date | null;
    banReason: string | null;
};

export type MemberProfile = {
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