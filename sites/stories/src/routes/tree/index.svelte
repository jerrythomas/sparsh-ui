<script>
	import StoryWrapper from '$lib/StoryWrapper.svelte'
	import { Tree } from '@sparsh-ui/list'

	export let variants
	let props
</script>

<StoryWrapper component={'Tree'} {variants} bind:props>
	<div class="flex w-60 border px-4 py-2 border-gray-400" slot="component">
		{#if props}
			<Tree {...props} />
		{/if}
	</div>
</StoryWrapper>
