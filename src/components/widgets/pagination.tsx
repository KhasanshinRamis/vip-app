import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PaginationProps {
	page: number;
	hasPrev: boolean;
	hasNext: boolean;
}

export const Pagination = ({ page, hasPrev, hasNext }: PaginationProps) => {
	const router = useRouter();

	return (
		<div className='grid grid-flow-col justify-between items-center mx-9 mt-6'>
			<Button variant='destructive'
				onClick={() => router.push(`?page=${page - 1}`)}
				disabled={!hasPrev}
			>
				Предыдущий
			</Button>
			<Button variant='destructive'
				onClick={() => router.push(`?page=${page + 1}`)}
				disabled={!hasNext}
			>
				Следующий
			</Button>
		</div>
	);
};