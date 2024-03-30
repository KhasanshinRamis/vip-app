'use client';

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useRef } from 'react';
import Image from 'next/image';



export const Feature = () => {
	return (
		<div className='grid grid-cols-[720px_1fr] gap-x-8 items-center'>
			<Image
				src='/img6.jpg'
				alt='Oooops...'
				width={720}
				height={480}
				className='shadow-md'
			/>
			<div className='grid gap-y-8'>
				<h2 className='text-2xl font-medium text-slate-200'>Наслаждайтесь историями и творческими идеями.</h2>
				<p className='text-xl font-normal text-slate-300'>Делитесь своими взглядами, открывайте себе новые возможности и будьте на одной волне с обществом нашего блога</p>
			</div>
		</div>
	);
}