<script>
	import { Icon } from '@sparsh-ui/icons'
	import ListItems from './ListItems.svelte'
	import Text from './items/Text.svelte'
	import Slider from './Slider.svelte'
	// import DropDownIcon from './icons/DropDownIcon.svelte'

	export let data
	export let component = null
	export let selected = null
	export let key = 'id'
	export let selectedKey

	let opened = false

	function handleSelect(event) {
		console.log('selected', event)
		selected = event.detail
	}
</script>

<div
	class="flex flex-col outline-none w-full h-12 relative z-1 dropdown"
	class:opened
	on:focus={() => (opened = true)}
	on:blur={() => (opened = false)}
	tabindex={0}
>
	<div class="flex flex-shrink-0 h-12 items-center pl-4 selected-item">
		<span class="flex flex-grow">
			<Text {component} item={selected} />
		</span>
		<Icon name="selector" />
		<!-- <DropDownIcon /> -->
	</div>

	{#if opened}
		<Slider class="h-60 absolute top-12 w-full z-1">
			<ListItems
				bind:items={data}
				{key}
				{component}
				bind:selected={selectedKey}
				on:select={handleSelect}
				on:change
			/>
		</Slider>
	{/if}
</div>
