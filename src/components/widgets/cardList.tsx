'use client';

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link';
import Image from 'next/image';
import { BeatLoader } from 'react-spinners';
import { IPost } from '@/interfaces/post.interface';
import postService from '@/services/postService';
import { Pagination } from '@/components/widgets/pagination';

interface CardListProps {
	page: number;
	category?: string | undefined;
}

export const CardList = ({ page, category }: CardListProps) => {

	const POST_PER_PAGE = 4;

	const { data: postsData, isLoading, isSuccess } = useQuery({
		queryKey: ['posts', `page=${page}`],
		queryFn: () => postService.getAll(page, category),
		select: ({ data }) => data,
	});


	const hasPrev = POST_PER_PAGE * (page - 1) > 0;
	const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < postsData?.count;


	return (
		<div>
			<h2 className='text-2xl font-medium text-slate-200'>Записи:</h2>
			{isLoading && <div className='grid justify-center'><BeatLoader className='grid grid-flow-col mt-6' /></div>}
			{isSuccess && <div className='grid mt-6'>
				{Array.isArray(postsData.posts) && postsData.posts.map((post: IPost) => (
					<div key={post.id} className='grid grid-cols-[minmax(240px,_580px)_1fr] items-center gap-[50px] mt-6'>
						<div className='h-[350px] relative'>
							{post.img && <Image src={post.img} alt={post.title} className='object-cover' fill />}
						</div>

						<div className='grid gap-5'>
							<div>
								<span className='text-gray-600'>{post.createdAt.substring(0, 10)} - </span>
								<span className='text-[#dc143c] font-medium'>{post.categorySlug.toUpperCase()}</span>
							</div>

							<Link href={`/posts/${post.slug}`}>
								<h1>{post.title}</h1>
							</Link>

							<div>
								<div dangerouslySetInnerHTML={{ __html: post?.description.substring(0, 60) }} className='text-[18px] font-light' />
								<Link href={`/posts/${post.slug}`} className='border-b border-[#dc143c]'>Read More</Link>
							</div>

						</div>
					</div>
				))}
			</div>}
			<Pagination hasNext={hasNext} hasPrev={hasPrev} page={page} />
		</div>
	)
}