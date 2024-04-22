import authConfig from "@/auth.config";
import NextAuth from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, apiBlog, apiPost, apiPrefix, authRoutes, publicBlogRoutes, publicPostRoutes, publicRoutes, } from '@/routes';
import { NextResponse } from 'next/server';


const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	console.log('Route: ', req.nextUrl.pathname);
	console.log('IS LOGGEDIN: ', isLoggedIn);

	// не нужно защищать айпи запросы
	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isApiPublicPosts = nextUrl.pathname.startsWith(apiPost);
	const isApiPublicBlog = nextUrl.pathname.startsWith(apiBlog);
	const isApiRoute = apiPrefix.includes(nextUrl.pathname);
	const isPublicPostsRoute = nextUrl.pathname.startsWith(publicPostRoutes);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isBlogRoute = publicBlogRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute || isApiPublicPosts || isApiRoute || isApiPublicBlog) {
		return NextResponse.next();
	};


	if (isAuthRoute) {
		if (isLoggedIn) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		return NextResponse.next();
	};

	if (!isLoggedIn && !isPublicRoute && !isPublicPostsRoute && !isBlogRoute) {
		let callbackUrl = nextUrl.pathname;

		if (nextUrl.search) {
			callbackUrl += nextUrl.search;
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
	};

	return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};