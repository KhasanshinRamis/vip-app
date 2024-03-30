import { CategoryList } from '@/components/widgets/categoryList';
import { CardList } from '@/components/widgets/cardList';
import { Feature } from '@/components/widgets/feature';

export default function Home() {
	return (
		<main className='grid items-center justify-center px-24 py-12 gap-y-12'>
			<Feature />
			<CategoryList />
			<CardList />
		</main>
	);
}
