<script>
	// import { namedShapes } from '../lib/shape'
	import { swatchStore } from '../swatch'

	export let x = 0
	export let y = 0
	export let size = 10
	export let fill = 'none'
	export let stroke = 'currentColor'
	export let thickness = 0.5

	export let name = 'circle'
	// export let shape = null

	$: x = x - size / 2
	$: y = y - size / 2

	$: d = $swatchStore[shapes][name](size)
	// typeof shape === 'function'
	// 	? shape(size)
	// 	: (shape || name) in namedShapes
	// 	? namedShapes[shape || name](size)
	// 	: namedShapes.circle(size)
</script>

<path
	{d}
	{fill}
	{stroke}
	transform="translate({x},{y})"
	stroke-width={thickness}
	fill-rule="evenodd"
	on:click
	on:mouseover
	on:mouseleave
	on:focus
/>
