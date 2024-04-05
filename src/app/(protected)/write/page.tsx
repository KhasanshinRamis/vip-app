'use client';

import { Button } from '@/components/ui/button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage, FormField } from '@/components/ui/form';
import { FormError } from '@/components/formError';
import { FormSuccess } from '@/components/formSuccess';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPostSchema } from '@/schemas';
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import * as z from 'zod';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import postService from '@/services/postService';
import { app } from '@/config/firebase';
import { useCurrentUser } from '@/hooks/useCurrentUser';



export default function WritePage() {
	const queryClient = useQueryClient();


	const [media, setMedia] = useState<string>('');
	const [file, setFile] = useState<Blob | Uint8Array | ArrayBuffer>();
	const [disabledFromMedia, setDisabledFromMedia] = useState<boolean>(false);

	const [success, setSuccess] = useState<string | undefined>('');
	const [errorMessage, setErrorMessage] = useState<string | undefined>('');

	useEffect(() => {
		const storage = getStorage(app);
		const upload = () => {
			if (file) {

				const name = new Date().getTime().toString();
				const storageRef = ref(storage, name);

				const uploadTask = uploadBytesResumable(storageRef, file);

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log("Upload is " + progress + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
						}
					},
					(error) => { console.log(error.message) },
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							setMedia(downloadURL);
							setDisabledFromMedia(true);
							console.log('File available at', downloadURL);
						});
					}
				);
			}
		};

		file && upload();
	}, [file]);

	const form = useForm<z.infer<typeof NewPostSchema>>({
		resolver: zodResolver(NewPostSchema)
	});

	const mutation = useMutation({
		mutationKey: ['new-post'],
		mutationFn: (values: z.infer<typeof NewPostSchema>) => postService.create(values),
		onSuccess: (data: any) => {
			console.log('Success!', data);
			console.log(data.success);
			setSuccess('Новая запись создана!');
			queryClient.invalidateQueries({ queryKey: ['new-post'] });
		},
		onError: (error: any) => {
			console.log(error.message);
			setErrorMessage(error.response.data.error);
			queryClient.invalidateQueries({ queryKey: ['new-post'] });
		}
	});

	const slugify = (str: string) => str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");


	const onSubmit = (values: z.infer<typeof NewPostSchema>) => {
		console.log(media);
		const updatedValues = {
			img: media,
			slug: slugify(values.title),
			...values
		};
		console.log('image mutation', updatedValues.image);
		mutation.mutate(
			updatedValues
		);
	};


	console.log("media: ", media);
	console.log("file: ", file);

	return (
		<Form {...form}>
			<form
				className='grid grid-rows-[64px_36px_32px_1fr_36px] gap-y-8 px-24 py-6 h-full'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									placeholder='Заголовок'
									className='text-6xl pl-0 py-8 text-white placeholder:text-white focus:border-none focus:outline-none border-none bg-transparent outline-none shadow-none'
									disabled={mutation.isPending}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='category'
					render={({ field }) => (
						<FormItem>
							<Select
								disabled={mutation.isPending}
								onValueChange={field.onChange}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											placeholder='Выберите категорию'

										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='style'>
										Стиль
									</SelectItem>
									<SelectItem value='fashion'>
										Мода
									</SelectItem>
									<SelectItem value='food'>
										Еда
									</SelectItem>
									<SelectItem value='culture'>
										Культура
									</SelectItem>
									<SelectItem value='travel'>
										Путешествие
									</SelectItem>
									<SelectItem value='coding'>
										Программирование
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='image'
					render={({ field }) => (
						<FormItem>
							<FormLabel
								className='grid justify-center items-center bg-stone-900 w-[32px] h-[32px] rounded-[50%]'
								htmlFor="image"
							>
								<Image src='/image.png' alt='Добавить изображение' width={16} height={16} />
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="file"
									id='image'
									disabled={mutation.isPending}
									onChange={(event) => setFile(event.target.files[0])}
									style={{ display: 'none' }}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<ReactQuill
									{...field}
									theme='bubble'
									placeholder='Расскажи свою историю...'
									className='[&>div>div>p]:text-xl [&>div>div>p]:text-white [&>div>div>p]:placeholder:text-white placeholder:[&>div>div>p]:text-2xl [&>div>div>h1]:text-white [&>div>div>h1]:text-text-5xl [&>div>div>h2]:text-white [&>div>div>h2]:text-text-3xl'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>


				<FormError message={errorMessage} />
				<FormSuccess message={success} />
				<Button
					type='submit'
					className='grid items-end'
					disabled={mutation.isPending && disabledFromMedia}
				>
					Создать новую запись
				</Button>
			</form>
		</Form>
	);
}
