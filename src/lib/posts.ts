import { Post } from '$lib/types';
export async function getPosts() {
	const posts: Post[] = [];
	const paths = import.meta.glob('/src/lib/posts/*.md', { eager: true });
	const rawPaths = import.meta.glob('/src/lib/posts/*.md', { eager: true, query: '?raw', import: 'default' });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'body'>;

			// Extract body content from raw markdown
			let body: string | undefined;
			if (rawPaths[path]) {
				const rawContent = rawPaths[path] as string;
				// Split by frontmatter delimiter and get content after
				const parts = rawContent.split('---');
				if (parts.length >= 3) {
					body = parts.slice(2).join('---').trim();
					body = body || undefined; // Convert empty string to undefined
				}
			}

			const post = { ...metadata, body } satisfies Post;
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
	return [...new Set(categories)];
}
