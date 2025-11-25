import { Post } from '$lib/types';
export async function load({ fetch }) {
	let response;

	response = await fetch('/api/posts');
	const posts: Post[] = await response.json();

	response = await fetch('/api/categories');
	const categories: string[] = await response.json();

	return { posts, categories };
}
