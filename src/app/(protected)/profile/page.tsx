'use client';

import { UserInfo } from '@/components/widgets/userInfo';
import { currentUser } from '@/lib/auth';
import axios from 'axios';


export default async function ClientPage() {
	const user = currentUser();

	if (user === undefined) await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/session`);

	return (
		<UserInfo label='Профиль' user={user} />
	);
};