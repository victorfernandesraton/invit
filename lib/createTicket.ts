import { TicketPost } from '../src/types'
import { numToCurrencyString } from './utils/currency'
import { parseDateToString } from './utils/date'

export function createGoogleClass(classId: string, params: TicketPost['data']) {
	return {
		eventId: `${classId}_${params.ticket.commitment_id}`,
		eventName: {
			defaultValue: {
				language: 'en-US',
				value: params.ticket.title,
			},
		},
		venue: {
			name: {
				defaultValue: {
					language: 'en-US',
					value: params.ticket.description,
				},
			},
		},
		dateTime: {
			start: params.ticket.start_at,
		},
		id: `${classId}_CLASS_${params.ticket.commitment_id}`,
		issuerName: 'Issuer name',
		reviewStatus: 'UNDER_REVIEW',
	}
}

export function createGoogleTicket(issuerId: string, classId: string, params: TicketPost['data']) {
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
		classId: `${classId}_CLASS_${params.ticket.commitment_id}`,
		genericType: 'GENERIC_TYPE_UNSPECIFIED',
		hexBackgroundColor: '#4285f4',
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
		barcode: {
			type: 'QR_CODE',
			value: `${params.ticket.id}`,
		},
	}
}
