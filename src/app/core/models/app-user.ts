import {Role} from "./role";

export interface AppUser {
    id?: number;
    firstName: string;
    lastName?: string;
    email: string;
    city?: string;
    country?: string;
    street?: string;
    enabled?: boolean;
    imageUrl?: any;
    social?: boolean;
    expirationDate?: Date;
    roles?: Role[];
}
