import { Post } from '$lib/types';
export async function getPosts() {
	const posts: Post[] = [];
	const paths = import.meta.glob('/src/lib/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Post;
			const post = { ...metadata } satisfies Post;
			posts.push(post);
		}
	}
	return posts;
}

export async function getPostCategories() {
	const categories: string[] = [];
	const paths = import.meta.glob('/src/lib/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];

		if (file && typeof file === 'object' && 'metadata' in file) {
			const metadata = file.metadata;
			categories.push(metadata.category);
		}
	}
	return categories;
}
