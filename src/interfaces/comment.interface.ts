import { IUser } from './user.interface';

export interface IComment {
    id: string;
    createdAt: number; 
    description: string;
    userEmail: string;
    postSlug: string
	user: IUser;
}