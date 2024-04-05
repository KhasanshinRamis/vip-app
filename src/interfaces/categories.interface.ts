import { IPost } from './post.interface';

export interface ICategory {
	id: string;
    slug: string;
    title: string;
    img: string;
    Posts: IPost[];
}

