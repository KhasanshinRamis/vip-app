'use client';

import { Comments } from '@/components/widgets/comments';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import postService from '@/services/postService';
import { PacmanLoader } from 'react-spinners';
import { formatTime } from '@/helpers';
import { cn } from '@/lib/utils';


export default function SinglePage({ params }: any) {

	const { slug } = params;

	const { data: postData, isLoading, isSuccess } = useQuery({
		queryKey: ['post', slug],
		queryFn: () => postService.getBySlug(slug),
		select: ({ data }) => data
	});

	console.log(postData?.post)

	return (
		<main className='grid gap-y-8 px-24 py-6 min-h-screen'>
			{isLoading && (
				<div className='grid justify-center items-center'>
					<PacmanLoader color='#36d7b7' size='50' />
				</div>
			)}
			{isSuccess && (
				<>
					<div className='grid grid-flow-row grid-cols-2 xl:grid-cols-1 gap-[20px] items-center'>
						<div>
							<h1 className='text-2xl text-white text-primary text-center font-semibold mb-12'>{postData?.post?.title}</h1>
							<div className='2xl:grid 2xl:grid-flow-col 2xl:grid-cols-[1fr_62px] 2xl:items-center'>
								<div className='grid grid-flow-col grid-cols-[50px_1fr] gap-x-2 mb-4'>
									<div className='relative h-[50px] w-[50px]'>
										{postData?.user?.image && <Image src={postData?.user?.image} alt={postData?.user?.name} fill className='object-cover rounded-[50%]' />}
									</div>
									<div className='grid gap-1 text-white'>
										<span className='text-lg font-medium'>{postData?.user?.name}</span>
										<span>{formatTime(postData?.post?.createdAt)}</span>
									</div>
								</div>
								<div className='grid justify-start'>
									<span className='rounded-lg shadow-md bg-cyan-950 text-slate-100 italic font-light text-xl p-2'>{postData?.post?.categorySlug}</span>
								</div>
							</div>
						</div>
						<div className='relative h-[450px]'>
							{postData?.post?.img && <Image src={postData?.post?.img} alt={postData?.post?.title} fill className='object-fill' />}
						</div>
					</div>
					<div className='grid mt-4'>
						<div
							className={cn('[&>p]:text-base [&>p]:text-white [&>h1]:text-white [&>h1]:text-text-3xl [&>h2]:text-white [&>h2]:text-xl [&>ol>li]:text-base [&>ol>li]:text-white')}
							style={{}}
							dangerouslySetInnerHTML={{ __html: postData?.post?.description }} />
						<div>
							<Comments postSlug={postData?.post?.slug} />
						</div>
					</div>
				</>
			)}

		</main>
	);
}