import Image from 'next/image';
import Link from 'next/link';
import { FaCopyright } from "react-icons/fa";

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='grid grid-flow-col grid-cols-[1fr_1fr] gap-x-2 gap-y-2 items-center w-full py-4 px-24'>
			<div >
				<div className='grid grid-cols-[50px_1fr] gap-x-2 items-center'>
					<Image src='/img1.jpg' alt='Logotype' width={50} height={50} className='rounded-[50%]' />
					<div>
						<Link href='/'>
							<h1
								className='text-xl font-semibold text-white cursor-pointer'
							>
								Взгляды и перспективы
							</h1>
						</Link>
						<p className='text-sm font-normal italic text-white cursor-pointer'>
							Описание
						</p>
					</div>

				</div>

			</div>
			<div className='grid justify-end'>
				<p className='grid grid-flow-col gap-x-1 items-center text-base font-medium text-white cursor-pointer'>
					Все права защищены {currentYear} <FaCopyright />
				</p>
			</div>


		</footer>
	);
};