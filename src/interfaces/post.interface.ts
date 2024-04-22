import { IComment } from './comment.interface';
import { IUser } from './user.interface';

export interface IPost {
	posts: any;
	count: any;
	id: string;
	createdAt: Date;
	slug: string;
	title: string;
	description: string;
	img?: string;
	views: number;
	categorySlug: string;
	userEmail: string;
	page: number;
	user: IUser;
	comments: IComment[];
}