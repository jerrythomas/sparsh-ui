import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'
import Sidebar from '../src/Sidebar.svelte'

describe('Sidebar.svelte', () => {
	beforeEach(() => cleanup())

	it('should render the navigation Sidebar', () => {
		const { container } = render(Sidebar, {
			items: [{ name: 'Alpha' }, { name: 'Beta' }]
		})
		expect(container).toBeTruthy()
	})
})