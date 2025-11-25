<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { AccordionItem, Accordion } from 'flowbite-svelte';
	import { Badge, P } from 'flowbite-svelte';

	import type { PageData } from './$types';
	import type { Post } from '$lib/types';

	let { data }: { data: PageData } = $props();

	// State for selected category filter
	let selectedCategory = $state<string | null>(null);

	// Computed filtered posts based on selected category
	let filteredPosts = $derived(
		selectedCategory
			? data.posts.filter((post) => post.category === selectedCategory)
			: data.posts
	);

	// Get unique categories for the nav
	let uniqueCategories = $derived([...new Set(data.categories)]);

	// Handle category selection
	function selectCategory(category: string) {
		selectedCategory = selectedCategory === category ? null : category;
	}

	// Clear filter
	function clearFilter() {
		selectedCategory = null;
	}
</script>

<Navbar>
	<NavBrand href="/">
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">BOLUS</span>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href="/" active={selectedCategory === null} onclick={clearFilter}>Alle</NavLi>
		{#each uniqueCategories as category}
			<NavLi
				href="/"
				active={selectedCategory === category}
				onclick={(e) => {
					e.preventDefault();
					selectCategory(category);
				}}
			>
				{category}
			</NavLi>
		{/each}
	</NavUl>
</Navbar>

<div class="container mx-auto p-4">
	{#if filteredPosts.length === 0}
		<P class="text-center text-gray-500 mt-8">Keine Einträge gefunden.</P>
	{:else}
		<Accordion>
			{#each filteredPosts as post}
				<AccordionItem>
					{#snippet header()}
						<div class="flex items-center gap-2">
							<Badge large color="purple">{post.content} KE</Badge>
							<div>
								<P size="base">{post.title}</P>
								<P size="xs" class="text-gray-500">({post.unit})</P>
							</div>
						</div>
					{/snippet}
					<div class="space-y-2">
						<P size="sm" weight="semibold">Verfügbare Mengen:</P>
						<div class="flex flex-wrap gap-2">
							{#each post.quantities as quantity}
								<Badge color="dark">{quantity}x</Badge>
							{/each}
						</div>
					</div>
				</AccordionItem>
			{/each}
		</Accordion>
	{/if}
</div>
