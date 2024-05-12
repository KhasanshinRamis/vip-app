import { IPost } from '@/interfaces/post.interface';
import axios from 'axios';

interface IChangeRecord {
	postId: string;
}

interface IUpdatePost {
	title: string;
	category: "style" | "fashion" | "food" | "culture" | "travel" | "coding";
	description: string;
	image?: string | undefined;
}

class RecordService {
	private URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/records`;

	async getByUser() {
		return axios.get<IPost>(`${this.URL}`);
	}

	async getByPost(postId: IChangeRecord) {
		return axios.post<IPost>(`${this.URL}`, postId);
	}

	async delete(postId: IChangeRecord) {
		return axios.delete(`${this.URL}`, { data: postId })
	}

	async update(post: IUpdatePost) {
		return axios.put(`${this.URL}`, { data: post })
	}
}

export default new RecordService();