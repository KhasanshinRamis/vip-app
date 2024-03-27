'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@/components/auth/userButton';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSession } from 'next-auth/react';
import { LoginButton } from '../auth/loginButton';


export const Navbar = () => {

	const session = useSession();
	const router = useRouter();

	const onClick = (redirect: string) => {
		redirect === 'write' ? router.push('/write') : router.push('/')
	}

	console.log(session.status);
	console.log(session.status === 'unauthenticated')

	if (session.status === 'authenticated') {
		return (
			<nav className='grid grid-flow-col grid-cols-[1fr_40px] gap-x-2 items-center w-full p-4'>
				<div className='grid grid-flow-col grid-cols-[1fr_200px] px-4'>
					<Link href='/'>
						<h1
							className='text-3xl font-semibold text-white cursor-pointer'
						>
							Взгляды и перспективы
						</h1>
					</Link>
					<Button variant='new' onClick={() => router.push('/write')}>
						Новая запись
					</Button>
				</div>
				<div>
					<UserButton />
				</div>
			</nav>
		);
	} else if (session.status === 'unauthenticated') {
		return (

			<nav className='grid grid-flow-col grid-cols-[1fr_120px] gap-x-2 items-center w-full p-4'>
				<div className='grid justify-start px-4'>
					<Link href='/'>
						<h1
							className='text-3xl font-semibold text-white cursor-pointer'
						>
							Взгляды и перспективы
						</h1>
					</Link>
				</div>
				<div>
					<LoginButton>
						<Button variant='default' size='lg'>
							Войти
						</Button>
					</LoginButton>
				</div>
			</nav>
		);
	}
};