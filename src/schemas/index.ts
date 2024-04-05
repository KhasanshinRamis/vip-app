import { UserRole } from '@prisma/client';
import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 30;
const ACCEPTED_IMAGE_MIME_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];


export const LoginSchema = z.object({
	email: z.string().email({
		message: "Email is required",
	}),
	password: z.string().min(1, {
		message: "Password is required",
	}),
	code: z.optional(z.string()),
	twoFactor: z.optional(z.boolean()),
	callbackUrl: z.optional(z.string().nullable()),
});

export const RegisterSchema = z.object({
	email: z.string().email({
		message: "Email is required",
	}),
	password: z.string().min(6, {
		message: "Minimum of 6 characters required",
	}),
	name: z.string().min(1, {
		message: 'Name is required!'
	})
});

export const ResetSchema = z.object({
	email: z.string().email({
		message: "Email is required",
	})
});

export const NewPasswordSchema = z.object({
	password: z.string().min(6, {
		message: "Minimum of 6 characters required",
	}),
	token: z.string(),
});

export const SettingsSchema = z.object({
	name: z.optional(z.string()),
	email: z.optional(z.string().email()),
	password: z.optional(z.string().min(6)),
	newPassword: z.optional(z.string().min(6)),
	isTwoFactorEnabled: z.optional(z.boolean()),
	role: z.enum([UserRole.ADMIN, UserRole.USER])
}).refine((data) => {
	if (data.password && !data.newPassword) return false;

	return true;
}, {
	message: 'New password is required!',
	path: ['newPassword']
}).refine((data) => {
	if (data.newPassword && !data.password) return false;

	return true;
}, {
	message: 'Password is required!',
	path: ['Password']
});

export const NewPostSchema = z.object({
	title: z.string().min(1, { message: "Поле пустое!" }),
	category: z.enum(['style', 'fashion', 'food', 'culture', 'travel', 'coding'], {
		required_error: 'Выберите категорию!',
	}),
	image: z.optional(z.string()),
	description: z.string().min(1, { message: "Поле пустое!" }),
});