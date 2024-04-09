import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: '2ФА код',
		html: `<p>Ваш код 2ФА: ${token}<p>`
	});
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${domain}/auth/new-password?token=${token}`;

	console.log(resetLink);

	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Сбросить пароль',
		html: `<p>Нажмите на <a href="${resetLink}">меня</a>, чтобы сбросить пароль.<p>`
	});
};

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`;

	console.log(confirmLink);


	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Подтвердите свой адрес электронной почты',
		html: `<p>Нажмите на <a href="${confirmLink}">меня</a>, чтобы подтвердить свой email.<p>`
	});
};