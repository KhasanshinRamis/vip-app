'use client';

import { UserInfo } from '@/components/widgets/userInfo';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { currentUser } from '@/lib/auth';


export default function ClientPage() {
	const user = useCurrentUser();

	return (
		<UserInfo label='Профиль' user={user} />
	);
};