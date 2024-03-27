import { Feature } from '@/components/widgets/feature';
import { CategoryList } from '@/components/widgets/categoryList';
import { CardList } from '@/components/widgets/cardList';

export default function Home() {
	return (
		<main className='grid  items-center justify-center'>
			<Feature />
			<CategoryList />
			<CardList />
		</main>
	);
}
