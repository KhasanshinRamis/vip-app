import { db } from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';

// Get single post
export const GET = async (req: NextRequest, { params }: any) => {

	const { slug } = params;

	try {
		const post = await db.post.findUnique({
			where: { slug },
			include: { user: true },
		});
		return NextResponse.json({post}, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};