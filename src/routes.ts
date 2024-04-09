/** 
* Массив маршрутов, доступных для общего пользования
* Эти маршруты не требуют аутентификации
* @type {string[]}
*/

export const publicRoutes = [
	'/',
	"/auth/new-verification"
];

export const publicRoutesWithPublication = [
	'/posts'
];

export const publicRoutesWithBlog = '/posts';


/** 
* Массив маршрутов, доступных для общего пользования
* Эти маршруты не требуют аутентификации
* @type {string[]}
*/



/**
* Массив маршрутов, которые используются для аутентификации
* Эти маршруты будут перенаправлять зарегистрированных пользователей в /settings
* @type {string[]}
*/

export const authRoutes = [
	'/auth/login',
	'/auth/register',
	'/auth/error',
	'/auth/reset',
	'/auth/new-password'
];

/**
* Префикс для маршрутов аутентификации API
* Маршруты, начинающиеся с этого префикса, используются для целей аутентификации API
* @type {string}
*/

export const apiAuthPrefix = '/api/auth';


export const apiPrefix = [
	'/api/categories',
	'/api/posts',
	'/api/comments',
];


/**
* Путь перенаправления по умолчанию после входа в систему
* @type {string}
*/

export const DEFAULT_LOGIN_REDIRECT = '/profile';