'use client';


import categoriesService from '@/services/categoriesService';
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link';
import Image from 'next/image';
import { ICategory } from '@/interfaces/categories.interface';
import { cn } from '@/lib/utils';
import styles from '@/components/widgets/categoryList.module.css';




export const CategoryList = () => {

	const { data: categoriesData, isLoading, isSuccess } = useQuery({
		queryKey: ['categories'],
		queryFn: () => categoriesService.getAll(),
		select: ({ data }) => data,
	});

	

	return (
		<div>
			<h2 className='text-2xl font-medium text-slate-200'>Популярные категории:</h2>
			<div className='grid grid-cols-6 gap-x-4 justify-evenly justify-self-center items-center mt-12'>
				{isLoading && <div>Загрузка...</div>}
				{isSuccess && Array.isArray(categoriesData) && categoriesData.map((category: ICategory) => (
					<Link
						key={category._id}
						href={`/blog?category=${category.slug}`}
						className={cn(styles[category.slug], 'grid grid-cols-[32px_1fr] gap-x-2 justify-center items-center text-center h-[60px] capitalize rounded-[10px] shadow-md pl-2')}	
					>
					{category.img && 
						<Image
							src={`/${category.img}`}
							alt={category.title}
							width={32}
							height={32}
							objectFit='cover'
							className='rounded-[50%] h-[32px]'
						/>
					}
					{category.title}
				</Link>
				))}
			</div>
		</div>
	)
}