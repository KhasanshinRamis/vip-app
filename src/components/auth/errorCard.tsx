import { Header } from '@/components/auth/header';
import { BackButton } from '@/components/auth/backButton';
import { Card, CardHeader, CardFooter } from '@/components/ui/card';
import { CardWrapper } from '@/components/auth/cardWrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';


export const ErrorCard = () => {
	return (
		<div className='grid min-h-screen justify-center items-center'>
			<CardWrapper
				headerLabel='Оооопс! Что-то пошло не так!'
				backButtonLabel='Вернуться к входу в систему'
				backButtonHref='/auth/login'
			>
				<div className='w-full grid justify-center items-center'>
					<ExclamationTriangleIcon className='text-destructive' />
				</div>
			</CardWrapper>
		</div >
	);
};