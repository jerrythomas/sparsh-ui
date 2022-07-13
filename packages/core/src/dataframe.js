import { v4 as uuid } from '@lukeed/uuid'
import { omit } from 'ramda'
import { deriveColumns, deriveSortableColumns } from './infer'
import { __data__, __cols__, __opts__, __pkey__, __subdf__ } from './symbols'
import { join } from './join'
import { groupBy, summarize } from './summary'

const defaultOpts = {
	missingColumns: false
}

function addColumnNames(colnames, row) {
	return [...new Set([...colnames, ...Object.keys(row)])]
}

export class DataFrame {
	constructor(data, opts = defaultOpts) {
		this[__data__] = [...data]
		this[__opts__] = { ...opts }
		this[__subdf__] = '_df'
		this[__cols__] =
			data.length === 0
				? []
				: opts.missingColumns
				? deriveColumns(data)
				: Object.keys(data[0])

		this[__pkey__] = undefined
		this[__opts__].missingColumns =
			opts.missingColumns || this[__cols__].length == 0
		this[__opts__].hasSurrogatePK = false
		this[__opts__].isGrouped = this[__cols__].includes(this[__subdf__])
	}

	get data() {
		return this[__data__]
	}

	get columns() {
		return this[__cols__]
	}

	get opts() {
		return this[__opts__]
	}

	get pkey() {
		return this[__pkey__]
	}

	key(attr = 'id') {
		this[__pkey__] = attr
		this[__opts__].hasSurrogatePK = !this[__cols__].includes(attr)
		if (this[__opts__].hasSurrogatePK) {
			this[__data__] = this[__data__].map((d) => ({ ...d, id: uuid() }))
		}
		return this
	}

	insert(row) {
		if (this[__opts__].missingColumns) {
			this[__cols__] = addColumnNames(this[__cols__], row)
		}

		this[__data__].push(
			this[__opts__].hasSurrogatePK ? { ...row, id: uuid() } : row
		)
		// add row to indexes
	}

	delete(query) {
		this[__data__] = this[__data__].filter((d) => !query(d))
		// reindex all indexes
	}

	update(query, data) {
		if (data) {
			this[__data__] = this[__data__].map((d) =>
				query(d) ? { ...d, ...data } : d
			)
			this[__cols__] = addColumnNames(this[__cols__], data)
			// reindex keys included in data
		} else {
			this[__data__] = this[__data__].map((d) => ({ ...d, ...query(d) }))
			// reindex all because we have no idea what changed
			this[__cols__] = addColumnNames(this[__cols__], this[__data__][0])
		}
	}

	join(df, query, opts = {}) {
		if (df instanceof DataFrame) {
			return new DataFrame(join(this[__data__], df.data, query, opts))
		} else if (Array.isArray(df)) {
			return new DataFrame(join(this[__data__], df, query, opts))
		}
		throw new TypeError(`expected DataFrame or Array, got ${typeof df}`)
	}

	sortBy(...cols) {
		const opts = deriveSortableColumns(...cols)

		this[__data__] = this.data.sort((a, b) => {
			let result = 0
			for (let i = 0; i < opts.length && result === 0; i++) {
				result = opts[i].sorter(a[opts[i].column], b[opts[i].column])
			}
			return result
		})
		// reindex all since order has changed
		return this
	}

	groupBy(...cols) {
		return new DataFrame(groupBy(...cols).from(this[__data__]))
	}

	summarize(...cols) {
		let result = []
		if (this[__opts__].isGrouped) {
			result = this[__data__].map((row) => ({
				...omit(['_df'], row),
				...summarize(row._df, ...cols)
			}))
		} else {
			result = [summarize(this[__data__], ...cols)]
		}
		return new DataFrame(result)
	}
}

export function dataframe(data, opts) {
	return new DataFrame(data, opts)
}