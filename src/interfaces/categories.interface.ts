import { Post } from './post.interface';

export interface ICategory {
	map(arg0: (category: ICategory) => import("react").JSX.Element): import("react").ReactNode;
	_id: string;
    slug: string;
    title: string;
    img: string;
    Posts: Post[];
}

