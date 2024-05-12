'use client';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import recordService from '@/services/recordService';
import { BeatLoader } from 'react-spinners';
import { IPost } from '@/interfaces/post.interface';
import Image from 'next/image';
import Link from 'next/link';
import { formatTime, truncateText } from '@/helpers';
import { IoIosSettings } from "react-icons/io";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormItem, FormLabel, FormMessage, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { NewPostSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ExtendedUser } from '../../../next-auth';
import { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '@/config/firebase';
import { FaFileImage } from 'react-icons/fa';
import { toast } from 'sonner';
import { Tiptap } from '@/components/ui/tiptap'


interface UserInfoProps {
	user?: ExtendedUser;
	label: string;
}

interface IChangeRecord {
	postId: string;
}

interface IUpdatePost {
	title: string;
	category: "style" | "fashion" | "food" | "culture" | "travel" | "coding";
	description: string;
	image?: string | undefined;
}


export const UserInfo = ({ user, label }: UserInfoProps) => {

	const queryClient = useQueryClient();


	const [media, setMedia] = useState<string>('');
	const [file, setFile] = useState<Blob | Uint8Array | ArrayBuffer>();
	const [disabledFromMedia, setDisabledFromMedia] = useState<boolean>(false);
	const [refresh, setRefresh] = useState<boolean>(false);

	const [recordForChange, setRecordForChange] = useState<IPost>();

	const slugify = (str: string) => {
		const randomString = Math.random().toString(36).substring(7);
		const slug = str.toLowerCase()
			.trim()
			.slice(0, 30)
			.replace(/\W_/g, "")
			.replace(/\s/g, "-")
			.replace(/^-+|-+$/g, "")
			.replace(/а/g, "a")
			.replace(/б/g, "b")
			.replace(/в/g, "v")
			.replace(/г/g, "g")
			.replace(/д/g, "d")
			.replace(/е/g, "e")
			.replace(/ё/g, "yo")
			.replace(/ж/g, "zh")
			.replace(/з/g, "z")
			.replace(/и/g, "i")
			.replace(/й/g, "y")
			.replace(/к/g, "k")
			.replace(/л/g, "l")
			.replace(/м/g, "m")
			.replace(/н/g, "n")
			.replace(/о/g, "o")
			.replace(/п/g, "p")
			.replace(/р/g, "r")
			.replace(/с/g, "s")
			.replace(/т/g, "t")
			.replace(/у/g, "u")
			.replace(/ф/g, "f")
			.replace(/х/g, "kh")
			.replace(/ц/g, "ts")
			.replace(/ч/g, "ch")
			.replace(/ш/g, "sh")
			.replace(/щ/g, "shch")
			.replace(/ъ/g, "")
			.replace(/ы/g, "y")
			.replace(/ь/g, "")
			.replace(/э/g, "e")
			.replace(/ю/g, "yu")
			.replace(/я/g, "ya");

		return `${slug}-${randomString}`;
	}

	const replaceRusCategoryOnEng = (categorySlug: string | undefined) => {
		if (categorySlug === 'Стиль') return 'style';
		if (categorySlug === 'IT') return 'coding';
		if (categorySlug === 'Путешествие') return 'travel';
		if (categorySlug === 'Культура') return 'culture';
		if (categorySlug === 'Еда') return 'food';
		if (categorySlug === 'Мода') return 'fashion';
	}

	const { data: recordsData, isLoading, isSuccess } = useQuery({
		queryKey: ['records'],
		queryFn: () => recordService.getByUser(),
		select: ({ data }) => data,
	});

	const form = useForm<z.infer<typeof NewPostSchema>>({
		resolver: zodResolver(NewPostSchema),

	});

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



	useEffect(() => {
		const cat = replaceRusCategoryOnEng(recordForChange?.categorySlug);
		form.reset({
			title: recordForChange?.title,
			category: cat,
			description: recordForChange?.description,
		});
	}, [recordForChange]);



	const mutationDataForChangeRecord = useMutation({
		mutationKey: ['change-post'],
		mutationFn: (val: IChangeRecord) => recordService.getByPost(val),
		onSuccess: (data: any) => {
			console.log("Data received:", data);
			const record = data.data;
			setRecordForChange(record);
			const cat = replaceRusCategoryOnEng(record.categorySlug);
			form.reset({
				title: record.title,
				category: cat,
				image: record.image,
				description: record.description,
			});
		}
	});

	const mutationOnDeleteRecord = useMutation({
		mutationKey: ['delete-record'],
		mutationFn: (val: IChangeRecord) => recordService.delete(val),
		onSuccess: (data) => {
			toast.success('Запись удалена!');
			queryClient.invalidateQueries({ queryKey: ['records'] })
		}
	});

	const mutationDataUpdateRecord = useMutation({
		mutationKey: ['update-post'],
		mutationFn: (val: IUpdatePost) => recordService.update(val),
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({ queryKey: ['records'] }),
				toast.success('Запись изменен!');
		}
	});

	const onDeleteRecord = (postId: string) => {
		const values = {
			postId
		};

		mutationOnDeleteRecord.mutate(values);
	};

	const onChangeRecord = (postId: string) => {
		const values = {
			postId
		};
		mutationDataForChangeRecord.mutate(values);
	};

	const onSubmit = (values: z.infer<typeof NewPostSchema>) => {
		console.log(media);
		const updatedValues = {
			id: recordForChange?.id,
			img: media,
			slug: slugify(values.title),
			...values
		};
		console.log('image mutation', updatedValues.image);
		mutationDataUpdateRecord.mutate(
			updatedValues
		);
	};

	const key = recordForChange ? recordForChange.id : "new";

	return (
		<div className='grid justify-center content-center min-h-screen'>
			<Card className='w-[600px] md:w-[450px] sm:w-[300px] shadow-md grid'>
				<CardHeader>
					<p className='text-2xl font-semibold text-center'>
						{label}
					</p>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid grid-flow-col items-center justify-between rounded-lg p-3 shadow-sm'>
						<p className='text-sm font-medium'>
							ФИО
						</p>
						<p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
							{user?.name}
						</p>
					</div>
					<div className='grid grid-flow-col items-center justify-between rounded-lg p-3 shadow-sm'>
						<p className='text-sm font-medium'>
							Email
						</p>
						<p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
							{user?.email}
						</p>
					</div>
					<div className='grid grid-flow-col items-center justify-between rounded-lg p-3 shadow-sm'>
						<p className='text-sm font-medium'>
							Роль
						</p>
						<p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
							{user?.role}
						</p>
					</div>
					<div className='grid grid-flow-col items-center justify-between rounded-lg p-3 shadow-sm'>
						<p className='text-sm font-medium'>
							Двухфакторная аутентификация
						</p>
						<Badge
							variant={user?.isTwoFactorEnabled ? 'success' : 'destructive'}
						>
							{user?.isTwoFactorEnabled ? 'ON' : 'OFF'}
						</Badge>
					</div>
				</CardContent>
				<CardHeader>
					<p className='text-2xl font-semibold text-center'>
						Мои записи
					</p>
				</CardHeader>
				<CardContent className='space-y-4'>
					{isLoading && <div className='grid justify-center'><BeatLoader className='grid grid-flow-col my-6' /></div>}
					{isSuccess && <div className='grid mt-6'>
						{recordsData === null && (
							<p className='p-3 font-medium italic text-slate-700'>
								Упс...К соажелению, у вас нет записей!
							</p>
						)}
						{Array.isArray(recordsData) && recordsData.map((record: IPost) => (
							<div key={record.id} className='grid items-center gap-y-1 mt-3'>
								<Link href={`/posts/${record.slug}`}>
									<h1 className='text-3xl text-primary font-semibold mb-1'>{record.title}</h1>
								</Link>
								<div className='grid grid-flow-row items-center grid-cols-[1fr_40px]'>
									<div>
										<span className='text-gray-700'>{formatTime(record.createdAt)} - </span>
										<span className='text-[#dc143c] font-medium'>{record.categorySlug.toUpperCase()}</span>
									</div>
									<Dialog>
										<DropdownMenu>
											<DropdownMenuTrigger className='grid ic justify-center'>
												<IoIosSettings />
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem onClick={() => onDeleteRecord(record.id)}>
													Удалить запись
												</DropdownMenuItem>
												<DropdownMenuItem onClick={() => onChangeRecord(record.id)}>
													<DialogTrigger onClick={() => setRefresh(!refresh)}>
														Редактировать запись
													</DialogTrigger>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
										<DialogContent className='max-w-[80%] max-h-[80%] rounded-sm'>
											<DialogHeader>
												<DialogTitle>Редактор записи</DialogTitle>
											</DialogHeader>
											{mutationDataForChangeRecord.isPending && <div className='grid justify-center'><BeatLoader className='grid grid-flow-col mt-6' /></div>}
											{mutationDataForChangeRecord.isSuccess && <Form {...form}>
												<form
													className='grid gap-y-4 sm:px-4 py-2'
													onSubmit={form.handleSubmit(onSubmit)}
													key={key}
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
																		className='text-3xl md:text-xl pl-0 py-8 focus:border-none focus:outline-none border-none bg-transparent outline-none shadow-none'
																		disabled={mutationDataUpdateRecord.isPending}
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
																	disabled={mutationDataUpdateRecord.isPending}
																	onValueChange={field.onChange}
																	defaultValue={field.value}
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
																		disabled={mutationDataUpdateRecord.isPending}
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
														disabled={mutationDataUpdateRecord.isPending}
														render={({ field }) => (
															<FormItem>
																<FormControl>
																	<Tiptap
																		description={field.value}
																		{...field}
																		className='overflow-y-scroll max-h-[200px]'
																	/>
																</FormControl>
															</FormItem>
														)}
													/>



													<Button
														type='submit'
														className='grid items-end'
														disabled={mutationDataUpdateRecord.isPending && disabledFromMedia}
													>
														Изменить запись
													</Button>
												</form>
											</Form>
											}
										</DialogContent>
									</Dialog>
								</div>

								{
									record.img && <div className='h-[350px] relative'>
										{record.img && <Image src={record.img} alt={record.title} className='object-cover' fill />}
									</div>
								}

								< div >
									<div dangerouslySetInnerHTML={{ __html: truncateText(record?.description, 52) }} className='text-xl text-primary font-base mb-2' />
									<Link href={`/posts/${record.slug}`} className='border-b border-[#dc143c] text-red-900 2xl:text-center'>Подробнее...</Link>
								</div>

							</div>
						))}
					</div>}
				</CardContent >
			</Card >
		</div >
	);
};