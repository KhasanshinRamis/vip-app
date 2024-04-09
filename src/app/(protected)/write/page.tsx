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
import { FaFileImage } from "react-icons/fa";
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPostSchema } from '@/schemas';
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import * as z from 'zod';
import { useEffect, useState } from 'react';
import postService from '@/services/postService';
import { app } from '@/config/firebase';



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

	const slugify = (str: string) => str.toLowerCase().trim().replace(/\W_/g, "").replace(/\s/g, "-").replace(/^-+|-+$/g, "").replace(/а/g, "a").replace(/б/g, "b").replace(/в/g, "v").replace(/г/g, "g").replace(/д/g, "d").replace(/е/g, "e").replace(/ё/g, "yo").replace(/ж/g, "zh").replace(/з/g, "z").replace(/и/g, "i").replace(/й/g, "y").replace(/к/g, "k").replace(/л/g, "l").replace(/м/g, "m").replace(/н/g, "n").replace(/о/g, "o").replace(/п/g, "p").replace(/р/g, "r").replace(/с/g, "s").replace(/т/g, "t").replace(/у/g, "u").replace(/ф/g, "f").replace(/х/g, "kh").replace(/ц/g, "ts").replace(/ч/g, "ch").replace(/ш/g, "sh").replace(/щ/g, "shch").replace(/ъ/g, "").replace(/ы/g, "y").replace(/ь/g, "").replace(/э/g, "e").replace(/ю/g, "yu").replace(/я/g, "ya").slice(0, 30);


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
		<div className='min-h-screen'>
			<Form {...form}>
				<form
					className='grid grid-rows-[64px_36px_32px_1fr_36px] gap-y-8 px-24 sm:px-4 py-6 h-full'
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
										className='text-3xl md:text-xl pl-0 py-8 text-white placeholder:text-white focus:border-none focus:outline-none border-none bg-transparent outline-none shadow-none'
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
									className='grid justify-center items-center bg-indigo-900 w-[32px] h-[32px] rounded-[50%]'
									htmlFor="image"
								>
									<FaFileImage width={16} height={16} color='#F5EFEF' />
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="file"
										id='image'
										disabled={mutation.isPending}
										onChange={(event) => {
											if (event.target.files && event.target.files.length > 0) {
												setFile(event.target.files[0]);
											}
										}}
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
										className='[&>div>div>p]:text-base [&>div>div>p]:text-white [&>div>div>p]:placeholder:text-white placeholder:[&>div>div>p]:text-2xl md:placeholder:[&>div>div>p]:text-lg [&>div>div>h1]:text-white  [&>div>div>h1]:text-text-3xl md:placeholder:[&>div>div>h1]:text-xl [&>div>div>h2]:text-white [&>div>div>h2]:text-xl [&>div>div>ol>li]:text-base [&>div>div>ol>li]:text-white'
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
		</div>
	);

}
