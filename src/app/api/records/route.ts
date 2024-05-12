import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export const GET = async () => {
	const user = await currentUser();

	if (!user) return NextResponse.json('No user!', { status: 401 });


	const currUser = await db.user.findFirst({
		where: {
			email: user.email
		}
	})

	const records = await db.post.findMany({
		where: {
			userId: currUser?.id
		},
		orderBy: {
			createdAt: 'desc'
		}
	});


	return NextResponse.json(records, { status: 200 });
}

export const DELETE = async (req: NextRequest) => {
	const body = await req.json();
	const user = await currentUser();

	if (!user) return NextResponse.json('No user!', { status: 401 });

	const { postId } = body;

	await db.post.delete({
		where: { id: postId }
	})

	return NextResponse.json('Delete record success', { status: 200 });
}


export const POST = async (req: NextRequest) => {
	const body = await req.json();
	const user = await currentUser();

	if (!user) return NextResponse.json('No user!', { status: 401 });

	const { postId } = body;

	const post = await db.post.findFirst({
		where: { id: postId }
	})

	return NextResponse.json(post, { status: 200 });
}


export const PUT = async (req: NextRequest) => {
	try {
		const user = await currentUser();
		const body = await req.json();


		if (!user) {
			return NextResponse.json({ error: "Необходимо авторизоваться" }, { status: 401 });
		}


		const catSlug = await db.category.findFirst({
			where: { slug: body.data.category }
		})

		console.log(body);

		const currPost = await db.post.findFirst({
			where: { id: body.data.id }
		})

		if (currPost?.id) {
			await db.post.update({
				where: { id: currPost.id },
				data: {
					createdAt: new Date(),
					categoryId: catSlug?.id,
					categorySlug: catSlug?.title,
					slug: body.data.slug,
					title: body.data.title,
					description: body.data.description,
					img: body.data.img
				},
			});
		}

		return NextResponse.json({ success: 'update' }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};