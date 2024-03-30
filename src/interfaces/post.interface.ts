import { IComment } from './comment.interface';
import { IUser } from './user.interface';

export interface IPost {
	posts: any;
	count: any;
	_id: string;
    createdAt: string;
    slug: string;
    title: string;
    description: string;
    img?: string;
    views: number;
    categorySlug: string;
	userEmail: string;
	user: IUser;
	comments: IComment[];
}