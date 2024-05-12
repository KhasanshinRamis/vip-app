'use client';

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link';
import Image from 'next/image';
import { IPost } from '@/interfaces/post.interface';
import postService from '@/services/postService';
import { formatTime, truncateText } from '@/helpers';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CardListProps {
	page: number;
	category?: string | undefined;
}

export const CardList = ({ page, category }: CardListProps) => {

	const router = useRouter();

	const POST_PER_PAGE = 4;
	const pageCounterArray: number[] = []

	const { data: postsData, isLoading, isSuccess } = useQuery({
		queryKey: ['posts', `page=${page}`],
		queryFn: () => postService.getAll(page, category),
		select: ({ data }) => data,
	});

	if (postsData?.count) {
		let count: number = 1
		if (postsData.count > 4) {
			pageCounterArray.push(count);
			for (let i: number = postsData.count; i > POST_PER_PAGE; i -= POST_PER_PAGE) {
				count += 1;
				pageCounterArray.push(count);
			}
		} else {
			pageCounterArray.push(count);
		}
	}

	const hasPrev = POST_PER_PAGE * (page - 1) > 0;
	const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < postsData?.count;


	return (
		<div>
			<h2 className='text-2xl font-medium text-slate-200'>Записи:</h2>
			{isLoading && (
				<div className='grid mt-6'>
					{[1, 2, 3, 4, 5].map((index) => (
						<div key={index} className='grid grid-cols-[minmax(240px,_580px)_1fr] xl:grid-cols-1 items-center gap-[50px] mt-6'>
							<div className='h-[350px] bg-slate-700 rounded-sm'>
							</div>

							<div className='grid gap-5'>
								<div>
									<span className='text-gray-700'>Время - </span>
									<span className='text-[#dc143c] font-medium'>Категория</span>
								</div>

								<div className='text-gray-300 font-semibold mb-1 text-lg'>
									Заголовок
								</div>

								<div>
									<div className='h-[200px] grid gap-[20px] px-3 mb-[20px]'>
										<div className='h-[20px] bg-slate-700 rounded-sm mt-[10px] gap-[20px]'></div>
										<div className='h-[20px] bg-slate-700 rounded-sm gap-[20px]'></div>
										<div className='h-[20px] bg-slate-700 rounded-sm gap-[20px]'></div>
										<div className='h-[20px] bg-slate-700 rounded-sm gap-[20px]'></div>
									</div>
									<span className='border-b border-[#dc143c] text-red-900 2xl:text-center'>Подробнее...</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)
			}
			{
				isSuccess && <div className='grid mt-6'>
					{Array.isArray(postsData.posts) && postsData.posts.map((post: IPost) => (
						<div key={post.id} className='grid grid-cols-[minmax(240px,_580px)_1fr] xl:grid-cols-1 items-center gap-[50px] mt-6'>
							<div className='h-[350px] relative'>
								{post.img && <Image src={post.img} alt={post.title} className='object-cover' fill />}
							</div>

							<div className='grid gap-5'>
								<div>
									<span className='text-gray-700'>{formatTime(post.createdAt)} - </span>
									<span className='text-[#dc143c] font-medium'>{post.categorySlug.toUpperCase()}</span>
								</div>

								<Link href={`/posts/${post.slug}`}>
									<h1 className='text-3xl text-white text-primary font-semibold mb-1'>{post.title}</h1>
								</Link>

								<div>
									<div dangerouslySetInnerHTML={{ __html: truncateText(post?.description, 52) }} className='text-xl text-white text-primary font-base mb-2' />
									<Link href={`/posts/${post.slug}`} className='border-b border-[#dc143c] text-red-900 2xl:text-center'>Подробнее...</Link>
								</div>

							</div>
						</div>
					))}
				</div>
			}
			<Pagination>
				<PaginationContent className='mt-6'>
					<PaginationItem>
						<Button variant='ghost' onClick={() => router.push(`?page=${page - 1}`)} disabled={!hasPrev}>Предыдущий</Button>

					</PaginationItem>
					{pageCounterArray.map((page: number) => (
						<PaginationItem key={`?page=${page}`}>
							<PaginationLink href={`?page=${page}`}>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<Button variant='ghost' onClick={() => router.push(`?page=${page + 1}`)} disabled={!hasNext}>Следующий</Button>
					</PaginationItem>
				</PaginationContent>
			</Pagination >

		</div >
	)
}