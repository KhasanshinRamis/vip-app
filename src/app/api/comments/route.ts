import { auth } from '@/auth';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Get all comments of a post
export const GET = async (req: NextRequest) => {

	const { searchParams } = new URL(req.url);

	const postSlug = searchParams.get("postSlug");

	try {
		const comments = await db.comment.findMany({
			where: {
				...(postSlug && { postSlug }),
			},
		});

		var user = [];

		for (let index = 0; index < comments.length; index++) {
			user[index] = await db.user.findFirst({
				where: { id: comments[index].userId }
			})
		}

		return NextResponse.json({ user, comments }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};

export const POST = async (req: NextRequest) => {

	try {
		const currUser = await currentUser();
		const body = await req.json();
		var comment;

		if (!currUser) {
			return NextResponse.json({ error: 'Необходимо авторизоваться!' }, { status: 401 });
		}

		var comment;

		if (currUser.id) {
			comment = await db.comment.create({
				data: {
					userId: currUser.id,
					postSlug: body.postSlug,
					description: body.description
				},
			});
		}

		const user = await db.user.findFirst({
			where: { id: comment?.userId }
		})

		return NextResponse.json({ user, comment }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};