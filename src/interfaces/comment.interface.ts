import { IUser } from './user.interface';

export interface IComment {
    _id: string;
    createdAt: number; 
    description: string;
    userEmail: string;
    postSlug: string
	user: IUser;
}