import { ReactNode } from 'react';

interface AuthLayoutProps {
	children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className='h-full grid items-center justify-center'>
			{children}
		</div>
	)
}