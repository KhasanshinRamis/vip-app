import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Get single post
export const GET = async (req: NextRequest, { params }: any) => {

	const { slug } = params;

	try {
		const post = await db.post.findUnique({
			where: { slug },
		});

		const user = await db.user.findFirst({
			where: { id: post?.userId }
		})

		return NextResponse.json({ post, user }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};