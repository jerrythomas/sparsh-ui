<script>
	import StepperDemo from '../pages/stepper/index.svelte'

	export let data = [
		{
			text: '01',
			label: 'Account Holder Detail',
			steps: { count: 4, value: 4, current: -1 },
			completed: true,
			active: false
		},
		{
			text: '02',
			label: 'Vehicle Detail',
			steps: { count: 4, value: 2, current: 3 },
			active: true
		},
		{
			text: '03',
			label: 'Vehicle Usage',
			steps: { count: 4, value: -1, current: -1 }
		},
		{
			text: '04',
			label: 'Additional Drivers',
			steps: { count: 4, value: -1, current: -1 }
		},
		{ text: '05', label: 'Summary' }
	]
	let currentStage = 2
</script>

<StepperDemo {data} {currentStage} />
