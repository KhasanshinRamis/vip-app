'use client';


import categoriesService from '@/services/categoriesService';
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link';
import Image from 'next/image';
import { ICategory } from '@/interfaces/categories.interface';
import { cn } from '@/lib/utils';
import styles from '@/components/widgets/categoryList.module.css';
import { BeatLoader } from 'react-spinners';



export const CategoryList = () => {

	const { data: categoriesData, isLoading, isSuccess } = useQuery({
		queryKey: ['categories'],
		queryFn: () => categoriesService.getAll(),
		select: ({ data }) => data,
	});



	return (
		<div>
			<h2 className='text-2xl font-medium text-slate-200'>Категории:</h2>
			{isLoading && <div className='grid grid-cols-6 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-evenly justify-self-center items-center mt-6'>
				<div className="bg-gray-500 text-gray-400 rounded-lg h-12 flex justify-center items-center gap-2 p-2">
					<div className="bg-gray-600 w-8 h-8 rounded-full"></div>
					<div className="bg-gray-400 w-24 h-4 rounded-md"></div>
				</div>
				<div className="bg-gray-500 text-gray-400 rounded-lg h-12 flex justify-center items-center gap-2 p-2">
					<div className="bg-gray-600 w-8 h-8 rounded-full"></div>
					<div className="bg-gray-400 w-24 h-4 rounded-md"></div>
				</div>
				<div className="bg-gray-500 text-gray-400 rounded-lg h-12 flex justify-center items-center gap-2 p-2">
					<div className="bg-gray-600 w-8 h-8 rounded-full"></div>
					<div className="bg-gray-400 w-24 h-4 rounded-md"></div>
				</div>
				<div className="bg-gray-500 text-gray-400 rounded-lg h-12 flex justify-center items-center gap-2 p-2">
					<div className="bg-gray-600 w-8 h-8 rounded-full"></div>
					<div className="bg-gray-400 w-24 h-4 rounded-md"></div>
				</div>
				<div className="bg-gray-500 text-gray-400 rounded-lg h-12 flex justify-center items-center gap-2 p-2">
					<div className="bg-gray-600 w-8 h-8 rounded-full"></div>
					<div className="bg-gray-400 w-24 h-4 rounded-md"></div>
				</div>
				<div className="bg-gray-500 text-gray-400 rounded-lg h-12 flex justify-center items-center gap-2 p-2">
					<div className="bg-gray-600 w-8 h-8 rounded-full"></div>
					<div className="bg-gray-400 w-24 h-4 rounded-md"></div>
				</div>
			</div>
			}
			{
				isSuccess && <div className='grid grid-cols-6 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-evenly justify-self-center items-center mt-6'>
					{Array.isArray(categoriesData) && categoriesData.map((category: ICategory) => (
						<Link
							key={category.id}
							href={`/blog?category=${category.title}`}
							className={cn(styles[category.slug], 'grid grid-cols-[32px_1fr] gap-x-2 justify-center items-center text-center h-[60px] capitalize rounded-[10px] shadow-md pl-2 text-indigo-950')}
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
			}
		</div >
	)
}