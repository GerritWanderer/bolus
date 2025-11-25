import { getPostCategories } from '$lib/posts';
import { json } from '@sveltejs/kit';

export async function GET() {
	const categories = await getPostCategories();
	return json(categories);
}
