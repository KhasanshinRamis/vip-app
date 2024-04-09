'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserButton } from '@/components/auth/userButton';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoginButton } from '../auth/loginButton';
import Image from 'next/image';
import { authRoutes } from '@/routes';


export const Navbar = () => {

	const session = useSession();
	const router = useRouter();
	const pathname = usePathname();

	const isAuthRoute = authRoutes.includes(pathname);

	if (session.status === 'authenticated') {
		return (
			<nav className='grid grid-flow-col grid-cols-[1fr_40px] gap-x-2 items-center w-full py-6 px-24 sm:px-4'>
				<div className='grid grid-flow-col items-center grid-cols-[1fr_200px] lg:grid-cols-1'>
					<Link href='/' className='grid grid-flow-col grid-cols-[40px_1fr] gap-x-3 items-center'>
						<Image src='/logo.svg' alt='Logo' width={40} height={40} />
						<h1
							className='text-3xl sm:text-xl font-semibold text-white cursor-pointer'
						>
							Взгляды и перспективы
						</h1>
					</Link>
					<Button className='lg:hidden' variant='new' onClick={() => router.push('/write')}>
						Новая запись
					</Button>
				</div>
				<div>
					<UserButton />
				</div>
			</nav>
		);
	} else if (session.status === 'unauthenticated') {
		if (isAuthRoute) {
			return (
				<nav className='grid items-center justify-center w-full py-6 px-24 sm:px-2'>

					<Link href='/'>
						<h1
							className='text-3xl sm:text-xl font-semibold text-white cursor-pointer'
						>
							Взгляды и перспективы
						</h1>
					</Link>

				</nav>
			)
		} else return (
			<nav className='grid grid-flow-col grid-cols-[1fr_120px] gap-x-2 items-center w-full py-6 lg:grid-cols-1 px-24 sm:px-2'>
				<div className='grid justify-start px-4'>
					<Link href='/'>
						<h1
							className='text-3xl sm:text-xl font-semibold text-white cursor-pointer'
						>
							Взгляды и перспективы
						</h1>
					</Link>
				</div>
				<div>
					<LoginButton>
						<Button className='lg:hidden' variant='default' size='lg'>
							Войти
						</Button>
					</LoginButton>
				</div>
			</nav>
		);
	}
};