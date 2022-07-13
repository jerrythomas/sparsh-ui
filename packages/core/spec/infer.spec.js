import { describe, expect, it } from 'vitest'
import { data } from './fixtures/sample'
import { counter } from '../src/summary'
import { ascending, descending } from 'd3-array'

import {
	deriveColumns,
	deriveAggregators,
	deriveSortableColumns
} from '../src/infer'

describe('utils', () => {
	const aggCols = [['fired'], ['fired', 'hits'], ['fired', 'hits', 'name']]

	it('should derive column names', () => {
		expect(deriveColumns([])).toEqual([])
		expect(deriveColumns(data)).toEqual(Object.keys(data[0]))
		expect(deriveColumns([{ name: 'alpha' }, { rank: 1 }])).toEqual([
			'name',
			'rank'
		])
	})

	it('should derive sorted columns', () => {
		expect(deriveSortableColumns('name')).toEqual([
			{ column: 'name', sorter: ascending }
		])
		expect(deriveSortableColumns('city', 'name')).toEqual([
			{ column: 'city', sorter: ascending },
			{ column: 'name', sorter: ascending }
		])
		expect(deriveSortableColumns(['city', false], 'name')).toEqual([
			{ column: 'city', sorter: descending },
			{ column: 'name', sorter: ascending }
		])
		expect(deriveSortableColumns(['city', true], ['name', false])).toEqual([
			{ column: 'city', sorter: ascending },
			{ column: 'name', sorter: descending }
		])
	})

	it.each(aggCols)('should derive column aggregators for', (...cols) => {
		const agg = deriveAggregators(...cols)
		const res = cols.map((column) => ({
			column,
			aggregator: counter,
			suffix: 'count'
		}))
		expect(agg).toEqual(res)

		agg.map((col) => {
			expect(col.aggregator([1, 2, 3, 4])).toEqual(4)
		})
	})
})