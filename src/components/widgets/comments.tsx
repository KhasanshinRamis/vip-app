'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import commentService from '@/services/commentService';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormItem, FormMessage, FormField } from '@/components/ui/form';
import { FormError } from '@/components/formError';
import { FormSuccess } from '@/components/formSuccess';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewCommentSchema } from '@/schemas';
import * as z from 'zod';
import { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { formatTime } from '@/helpers';


interface CommentsProps {
	postSlug: string
}


export const Comments = ({ postSlug }: CommentsProps): JSX.Element => {

	const { status } = useSession();
	const queryClient = useQueryClient();

	const [success, setSuccess] = useState<string | undefined>('');
	const [errorMessage, setErrorMessage] = useState<string | undefined>('');

	const { data: commentsData, isLoading, isSuccess } = useQuery({
		queryKey: ['comment', postSlug],
		queryFn: () => commentService.getAll(postSlug),
		select: ({ data }) => data
	});

	const form = useForm<z.infer<typeof NewCommentSchema>>({
		resolver: zodResolver(NewCommentSchema)
	});

	const mutation = useMutation({
		mutationFn: (newComment: z.infer<typeof NewCommentSchema>) => commentService.post(newComment),
		onSuccess: (data: any) => {
			console.log('Success!', data);
			console.log(data.success);
			setSuccess('Новая запись создана!');
			queryClient.invalidateQueries({ queryKey: ['comment', postSlug] });
		},
		onError: (error: any) => {
			console.log(error.message);
			setErrorMessage(error.response.data.error);
			queryClient.invalidateQueries({ queryKey: ['comment', postSlug] });
		}
	});

	const onSubmit = (newComment: z.infer<typeof NewCommentSchema>) => {
		const updatedNewCommentValues = {
			postSlug: postSlug,
			...newComment
		};
		mutation.mutate(
			updatedNewCommentValues
		);
	};

	console.log('commentsData', commentsData);


	return (
		<div className='mt-6'>
			<h1 className='text-2xl font-medium text-slate-200 mb-4'>Комментарии</h1>
			{status === 'authenticated' ? (
				<Form {...form}>
					<form
						className='grid items-center grid-flow-col justify-between grid-cols-[5fr_1fr] gap-[30px]'
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											{...field}
											placeholder='Напишите комментарии...'
											className='text-base font-normal py-2 bg-white text-gray-600 border-slate-900 placeholder:text-gray-600 shadow-md'
											disabled={mutation.isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type='submit'
							disabled={mutation.isPending}
						>
							Комментировать
						</Button>
					</form>
					<FormError message={errorMessage} />
					<FormSuccess message={success} />
				</Form>
			) : (
				<Link href='/auth/login' className='text-base italic font-semibold text-slate-400 mb-6'>Войти в систему, чтобы оставить комментарии</Link>
			)}
			<div className='mt-[50px]'>
				{isLoading && <div className='grid justify-center'><BeatLoader className='grid grid-flow-col mt-6' /></div>}
				{isSuccess && commentsData && commentsData.comments.map((comment: any, index: number) => (
					<Card className='mb-[50px]' key={comment.id}>
						<CardHeader>
							{commentsData.user[index]?.image &&
								<div className='grid grid-flow-col items-center grid-cols-[50px_1fr] gap-[20px]'>
									<Image
										src={commentsData.user[index]?.image}
										alt={commentsData.user[index]?.name}
										width={50}
										height={50}
										className='rounded-[50%] object-cover'
									/>
									<div className='grid gap-1'>
										<span className='text-lg text-gray-800 font-medium'>{commentsData.user[index]?.name}</span>
										<span className='text-sm font-light text-gray-600 italic'>{formatTime(comment.createdAt)}</span>
									</div>
								</div>
							}
							{!commentsData.user[index]?.image &&
								<div className='grid items-center '>
									<div className='grid gap-1'>
										<span className='text-lg text-gray-800 font-medium'>{commentsData.user[index]?.name}</span>
										<span className='text-sm font-light text-gray-600 italic'>{formatTime(comment.createdAt)}</span>
									</div>
								</div>
							}
						</CardHeader>
						<CardContent>
							<p className='text-base text-gray-700 font-normal'>{comment.description}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};

