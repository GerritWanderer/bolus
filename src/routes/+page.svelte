<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { AccordionItem, Accordion } from 'flowbite-svelte';
	import { Badge, P } from 'flowbite-svelte';
</script>

<Navbar>
	<NavBrand href="/">
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">BOLUS</span>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/docs/components/navbar">Navbar</NavLi>
		<NavLi href="/pricing">Pricing</NavLi>
		<NavLi href="/contact">Contact</NavLi>
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
