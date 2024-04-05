import { auth } from '@/auth';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Get all posts
export const GET = async (req: NextRequest) => {

	const { searchParams } = new URL(req.url);

	const page = searchParams.get('page');
	const category = searchParams.get('category');

	const POST_PER_PAGE = 4;
	const query = {
		take: POST_PER_PAGE,
		skip: POST_PER_PAGE * (Number(page) - 1),
		where: {
			...(category && { categorySlug: category }),
		},
	};

	try {
		const [posts, count] = await db.$transaction([
			db.post.findMany(query),
			db.post.count({ where: query.where }),
		]);
		return NextResponse.json({ posts, count }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};

export const POST = async (req: NextRequest) => {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: "Not Authenticated!" }, { status: 401 });
		}


		const body = await req.json();
		

		console.log('body:', body);

		const catSlug = await db.category.findFirst({
			where: { slug: body.category }
		})

		console.log(catSlug);

		var post;

		if (user.id && catSlug?.id) {
			post = await db.post.create({
				data: {
					userId: user.id,
					categoryId: catSlug?.id,
					categorySlug: catSlug?.slug,
					slug: body.slug,
					title: body.title,
					description: body.description,
					img: body.img
				},
			});
		}


		console.log(post);


		return NextResponse.json(post, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
};