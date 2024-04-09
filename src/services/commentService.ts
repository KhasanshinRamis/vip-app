import { IComment } from '@/interfaces/comment.interface';
import { NewCommentSchema } from '@/schemas';
import axios from 'axios';
import * as z from 'zod';

class CommentService {
	private URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/comments`;

	async getAll(postSlug: string) {
		return axios.get(`${this.URL}?postSlug=${postSlug}`);
	}

	async post(newComment: z.infer<typeof NewCommentSchema>) {
		return axios.post(`${this.URL}`, newComment);
	}
}

export default new CommentService();
