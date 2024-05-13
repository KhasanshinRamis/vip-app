'use client';

import { CategoryList } from '@/components/widgets/categoryList';
import { CardList } from '@/components/widgets/cardList';
import { Feature } from '@/components/widgets/feature';
import { useEffect, useRef } from 'react';

export default function Home({ searchParams }: any) {

	const page = parseInt(searchParams.page) || 1;
	const cardListRef = useRef<HTMLDivElement>(null);

	// useEffect(() => {
	// 	if (cardListRef.current) {
	// 		cardListRef.current.scrollIntoView({ behavior: 'smooth' });
	// 	}
	// }, [page]);


	return (
		<main className='grid items-center justify-center py-6 gap-y-12 px-24 sm:px-4'>
			<Feature />
			<CategoryList />
			<CardList page={page} />
		</main>
	);
}
