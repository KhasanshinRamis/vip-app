import Image from 'next/image';
import Link from 'next/link';
import { FaCopyright } from "react-icons/fa";

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='grid grid-flow-col grid-cols-[1fr_1fr] md:grid-flow-row md:grid-cols-[1fr] gap-x-2 gap-y-2 items-center w-full py-4 px-24 sm:px-4'>
			<div>
				<div className='grid grid-cols-[50px_1fr] gap-x-2 items-center'>
					<Image src='/logo.svg' alt='Logotype' width={50} height={50} className='rounded-[50%]' />
					<div>
						<Link href='/'>
							<h1
								className='text-xl sm:text-lg font-semibold text-white cursor-pointer'
							>
								Взгляды и перспективы
							</h1>
						</Link>
						<p className='text-sm sm:text-xs font-normal italic text-white cursor-pointer'>
							Здесь каждый найдет что-то для себя - от познавательных статей о саморазвитии до обзоров последних трендов.
						</p>
					</div>

				</div>

			</div>
			<div className='grid justify-end md:justify-center'>
				<p className='grid grid-flow-col gap-x-1 items-center sm:text-xs text-base font-medium text-white cursor-pointer'>
					Все права защищены <FaCopyright /> {currentYear}
				</p>
			</div>
		</footer>
	);
};