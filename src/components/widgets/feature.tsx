'use client';

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useRef } from 'react';
import Image from 'next/image';



export const Feature = () => {
	return (
		<div className='grid grid-cols-[720px_1fr] xl:grid-cols-[1fr] gap-x-8 items-center'>
			<div className='relative h-[500px] shadow-md xl:order-last'>
				<Image
					src='/img6.jpg'
					alt='Oooops...'
					fill
					className='object-cover'
				/>
			</div>
			<div className='grid gap-y-6 2xl:pb-6'>
				<h2 className='text-2xl font-medium text-slate-200'>Наслаждайтесь историями и творческими идеями.</h2>
				<p className='text-xl font-normal text-slate-300'>Делитесь своими взглядами, открывайте себе новые возможности и будьте на одной волне с обществом нашего блога.</p>
			</div>
		</div>
	);
}