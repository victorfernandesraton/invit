import { numToCurrencyString } from './utils/currency'
import { parseDateToString } from './utils/date'

type TicketParams = {
	ticket: {
		id: number
		title: string
		description: string
		start_at: Date
		end_at?: Date
		price: number
		currency: string
		remote: boolean
	}
	user: {
		email: string
		name: string
	}
}

export function createGoogleClass(classId: string) {
	return {
		id: classId,
		classTemplateInfo: {
			cardTemplateOverride: {
				cardRowTemplateInfos: [
					{
						twoItems: {
							startItem: {
								firstValue: {
									fields: [
										{
											fieldPath: "object.textModulesData['price']",
										},
									],
								},
							},
							endItem: {
								firstValue: {
									fields: [
										{
											fieldPath: "object.textModulesData['remote']",
										},
									],
								},
							},
						},
					},
					{
						twoItems: {
							startItem: {
								firstValue: {
									fields: [
										{
											fieldPath: "object.textModulesData['start_at']",
										},
									],
								},
							},
							endItem: {
								firstValue: {
									fields: [
										{
											fieldPath: "object.textModulesData['end_at']",
										},
									],
								},
							},
						},
					},
				],
			},
		},
	}
}

export function createGoogleTicket(issuerId: string, classId: string, params: TicketParams) {
	const textModulesData = [
		{
			id: 'price',
			header: 'Price',
			body: `${numToCurrencyString(params.ticket.price / 100, params.ticket.currency)} ${params.ticket.currency}`,
		},
		{
			id: 'remote',
			header: 'Remote',
			body: params.ticket.currency ? 'Yes' : 'No',
		},
		{
			id: 'start_at',
			header: 'Start At',
			body: parseDateToString(new Date(params.ticket.start_at)),
		},
	]

	if (params.ticket.end_at) {
		textModulesData.push({
			id: 'end_at',
			header: 'End At',
			body: parseDateToString(new Date(params.ticket.end_at)),
		})
	}

	return {
		id: `${issuerId}.${params.ticket.id}`,
		classId: `${classId}`,
		logo: {
			contentDescription: {
				defaultValue: {
					language: 'en',
					value: params.ticket.description,
				},
			},
		},
		cardTitle: {
			defaultValue: {
				language: 'en',
				value: params.ticket.title,
			},
		},
		subheader: {
			defaultValue: {
				language: 'en',
				value: params.ticket.description,
			},
		},
		header: {
			defaultValue: {
				language: 'en',
				value: params.user.name ?? params.user.email,
			},
		},
		textModulesData,
		barcode: {
			type: 'QR_CODE',
			value: 'BARCODE_VALUE',
			alternateText: null,
		},
		hexBackgroundColor: '#ed02e5',
	}
}
