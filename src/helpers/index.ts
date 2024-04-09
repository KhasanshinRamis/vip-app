


export const formatTime = (time: any) => {
	const date = new Date(time);
	const formattedTime = date.toString().slice(0, 16).replace("T", " ");
	return formattedTime;
}