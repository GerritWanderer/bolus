<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { AccordionItem, Accordion } from 'flowbite-svelte';
	import { Badge, P } from 'flowbite-svelte';

	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<Navbar>
	<NavBrand href="/">
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">BOLUS</span>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		{#each data.categories as category}
			<NavLi href="/">{category}</NavLi>
		{/each}
	</NavUl>
</Navbar>

<Accordion>
	<AccordionItem>
		{#snippet header()}
			<div class="flex items-center gap-2">
				<Badge large color="purple">2,5 KE</Badge>
				<div>
					<P size="base">Haferflocken mit Joghurt und Obst</P>
					<P size="xs">(Schuessel, 300g)</P>
				</div>
			</div>
		{/snippet}
		<p class="text-gray-500">Hello World</p>
	</AccordionItem>
</Accordion>
