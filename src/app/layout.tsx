import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TanstackProvider } from '@/providers/TanstackProvider';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/layout/navbar';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Взгляды и перспективы",
	description: "Делитесь своими взглядами, открывайте себе новые возможности и будьте на одной волне с обществом нашего блога.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="ru">
			<body className={cn(inter.className, 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 bg-fixed bg-cover')}>
				<TanstackProvider>
					<SessionProvider session={session}>
						<div className='min-h-full'>
							<div className='grid grid-rows-[auto_1fr_auto] min-h-full'>
								<Toaster />
								<Navbar />
								{children}
								<Footer />
							</div>
						</div>
					</SessionProvider>
				</TanstackProvider>
			</body>
		</html >
	);
}
