import { CardList } from '@/components/widgets/cardList';


export default function BlogPage({ searchParams }: any) {
	const page = parseInt(searchParams.page) || 1;
	const { category } = searchParams;

	return (
		<main className='grid py-6 gap-y-12 px-24 sm:px-2 min-h-screen'>
			<h1 className='grid text-3xl md:text-xl font-semibold text-white italic border-neutral-600 border rounded-xl p-[10px] text-center uppercase max-h-[70px] items-center'>{category} блог</h1>
			<div className='grid gap-6'>
				<CardList page={page} category={category} />
			</div>
		</main>
	);
}