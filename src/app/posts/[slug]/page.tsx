'use client';

// import { Comments } from '@/components/widgets/Comments/Comments';
import styles from './SinglePage.module.scss';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import postService from '@/services/postService';


export default function SinglePage({ params }: any) {
	const { slug } = params;


	const { data: postData, isLoading, isError, error } = useQuery({
		queryKey: ['post', slug],
		queryFn: () => postService.getBySlug(slug),
		select: ({ data }) => data
	});

	console.log(postData?.post)

	return (
		<div className='grid gap-y-8 px-24 py-6 h-full'>
			<div className='grid grid-flow-row grid-cols-2 gap-[20px] items-center'>
				<div>
					<h1 className='text-4xl text-white text-primary font-semibold mb-12'>{postData?.post?.title}</h1>
					<div className='grid grid-flow-col grid-cols-[50px_1fr] gap-x-2  mb-4'>
						<div className='relative h-[50px] w-[50px]'>
							{postData?.user?.image && <Image src={postData?.user?.image} alt={postData?.user?.name} fill className='object-cover rounded-[50%]' />}
						</div>
						<div className='grid gap-1 text-white'>
							<span className='text-xl font-medium'>{postData?.user?.name}</span>
							<span>{postData?.post?.createdAt}</span>
						</div>
					</div>
					<div className='grid justify-start'>
						<span className='rounded-lg shadow-md bg-cyan-950 text-amber-300 italic font-light text-xl p-2'>{postData?.post?.categorySlug}</span>
					</div>
				</div>
				<div className='relative h-[350px]'>
					{postData?.post?.img && <Image src={postData?.post?.img} alt={postData?.post?.title} fill className='object-cover' />}
				</div>
			</div>
			<div className='grid mt-[60px]'>
				<div className='text-white font-normal text-base' dangerouslySetInnerHTML={{ __html: postData?.post?.description }} />
				<div>
					{/* <Comments postSlug={postData?.slug} /> */}
				</div>
			</div>
		</div>
	);
}