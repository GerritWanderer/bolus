<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { AccordionItem, Accordion } from 'flowbite-svelte';
	import { Badge, P } from 'flowbite-svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// State for selected category filter
	let selectedCategory = $state<string | null>(null);

	// Computed filtered posts based on selected category
	let filteredPosts = $derived(
		selectedCategory ? data.posts.filter((post) => post.category === selectedCategory) : data.posts
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

	// Generate quantity steps with calculated KE values
	function generateQuantitySteps(baseKE: number, unit: string, quantities: string[]) {
		return quantities.map((qty) => {
			const qtyNum = parseFloat(qty);
			return {
				id: `${(baseKE * qtyNum).toFixed(1)} KE`,
				label: `${qtyNum} x (${unit})`,
				status: 'completed' as const
			};
		});
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
								<P size="xs" class="text-gray-500">{post.unit}</P>
							</div>
						</div>
					{/snippet}
					<div class="space-y-2">
						{#if post.body}
							<P size="base" class="text-gray-700 dark:text-gray-300">{post.body}</P>
						{/if}
						<P size="sm" weight="semibold">Verfügbare Mengen:</P>
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
							{#each generateQuantitySteps(parseFloat(post.content), post.unit, post.quantities) as step}
								<div
									class="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center"
								>
									<span class="text-lg font-bold text-purple-600 dark:text-purple-400"
										>{step.id}</span
									>
									<span class="text-xs text-gray-600 dark:text-gray-300">{step.label}</span>
								</div>
							{/each}
						</div>
					</div>
				</AccordionItem>
			{/each}
		</Accordion>
	{/if}
</div>
