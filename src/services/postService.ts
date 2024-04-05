import { IPost } from '@/interfaces/post.interface';
import axios from 'axios';
import * as z from 'zod';
import { NewPostSchema } from '@/schemas';

class PostService {
	private URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/posts`;

	async getBySlug(slug: string) {
		return axios.get(`${this.URL}/${slug}`);
	}

	async getAll(page: number | '', category: string | undefined) {
		return axios.get<IPost>(`${this.URL}?page=${page}&category=${category || ''}`);
	}

	async create(newPost: z.infer<typeof NewPostSchema>) {
		return axios.post(`${this.URL}`, newPost);
	}
}

export default new PostService();