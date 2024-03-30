import { ICategory } from '@/interfaces/categories.interface';
import axios from 'axios';


class CategoryService {
	private URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/categories`;

	async getAll() {
		return axios.get<ICategory>(`${this.URL}`);
	}
}

export default new CategoryService();