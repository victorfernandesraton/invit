import Nullstack, { NullstackServerContext } from 'nullstack'

import { GoogleAuth } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { readFileSync } from 'node:fs'

import Application from './src/Application'

const context = Nullstack.start(Application) as NullstackServerContext

const issuerId = context.secrets.googleIssuerId
const credentials = JSON.parse(
	readFileSync(context.secrets.googleApplicationCredentials, {
		encoding: 'utf-8',
	}),
)

// TODO: Define Class ID
const classId = `${issuerId}.codelab_class`

const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1'

const httpClient = new GoogleAuth({
	credentials,
	scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
})

async function createPassClass(req, res) {
	// TODO: Create a Generic pass class
	const genericClass = {
		id: `${classId}`,
		classTemplateInfo: {
			cardTemplateOverride: {
				cardRowTemplateInfos: [
					{
						twoItems: {
							startItem: {
								firstValue: {
									fields: [
										{
											fieldPath: 'object.textModulesData["points"]',
										},
									],
								},
							},
							endItem: {
								firstValue: {
									fields: [
										{
											fieldPath: 'object.textModulesData["contacts"]',
										},
									],
								},
							},
						},
					},
				],
			},
			detailsTemplateOverride: {
				detailsItemInfos: [
					{
						item: {
							firstValue: {
								fields: [
									{
										fieldPath: 'class.imageModulesData["event_banner"]',
									},
								],
							},
						},
					},
					{
						item: {
							firstValue: {
								fields: [
									{
										fieldPath: 'class.textModulesData["game_overview"]',
									},
								],
							},
						},
					},
					{
						item: {
							firstValue: {
								fields: [
									{
										fieldPath: 'class.linksModuleData.uris["official_site"]',
									},
								],
							},
						},
					},
				],
			},
		},
		imageModulesData: [
			{
				mainImage: {
					sourceUri: {
						uri: 'https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/google-io-2021-card.png',
					},
					contentDescription: {
						defaultValue: {
							language: 'en-US',
							value: 'Google I/O 2022 Banner',
						},
					},
				},
				id: 'event_banner',
			},
		],
		textModulesData: [
			{
				header: 'Gather points meeting new people at Google I/O',
				body: 'Join the game and accumulate points in this badge by meeting other attendees in the event.',
				id: 'game_overview',
			},
		],
		linksModuleData: {
			uris: [
				{
					uri: 'https://io.google/2022/',
					description: "Official I/O '22 Site",
					id: 'official_site',
				},
			],
		},
	}

	let response
	try {
		// Check if the class exists already
		response = await httpClient.request({
			url: `${baseUrl}/genericClass/${classId}`,
			method: 'GET',
		})

		console.log('Class already exists')
		// console.log(response)
	} catch (err) {
		if (err.response && err.response.status === 404) {
			// Class does not exist
			// Create it now
			response = await httpClient.request({
				url: `${baseUrl}/genericClass`,
				method: 'POST',
				data: genericClass,
			})

			console.log('Class insert response')
			// console.log(response)
		} else {
			// Something else went wrong
			console.log(err)
			res.status(400).json({
				message: 'Error',
			})
		}
	}
}

async function createPassObject(req, res) {
	// TODO: Create a new Generic pass for the user
	const objectSuffix = `${'vfbraton@gmail.com'.replace(/[^\w.-]/g, '_')}`
	const objectId = `${issuerId}.${objectSuffix}`

	const genericObject = {
		id: `${objectId}`,
		classId,
		genericType: 'GENERIC_TYPE_UNSPECIFIED',
		hexBackgroundColor: '#4285f4',
		logo: {
			sourceUri: {
				uri: 'https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/pass_google_logo.jpg',
			},
		},
		cardTitle: {
			defaultValue: {
				language: 'en',
				value: "Google I/O '22",
			},
		},
		subheader: {
			defaultValue: {
				language: 'en',
				value: 'Attendee',
			},
		},
		header: {
			defaultValue: {
				language: 'en',
				value: 'Alex McJacobs',
			},
		},
		barcode: {
			type: 'QR_CODE',
			value: `${objectId}`,
		},
		heroImage: {
			sourceUri: {
				uri: 'https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/google-io-hero-demo-only.jpg',
			},
		},
		textModulesData: [
			{
				header: 'POINTS',
				body: '1234',
				id: 'points',
			},
			{
				header: 'CONTACTS',
				body: '20',
				id: 'contacts',
			},
		],
	}

	// TODO: Create the signed JWT and link
	const claims = {
		iss: credentials.client_email,
		aud: 'google',
		origins: [],
		typ: 'savetowallet',
		payload: {
			genericObjects: [genericObject],
		},
	}

	const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' })
	const saveUrl = `https://pay.google.com/gp/v/save/${token}`

	res.send({ link: `${saveUrl}` })
}

context.server.post('/api/pass/google', async (req, res) => {
	console.log(req.body)
	await createPassClass(req, res)
	await createPassObject(req, res)
})

context.start = async function start() {
	// https://nullstack.app/application-startup
}

export default context
