import Nullstack, { NullstackServerContext } from 'nullstack'

import bodyParser from 'body-parser'
import { GoogleAuth } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { readFileSync } from 'node:fs'

import { createGoogleClass, createGoogleTicket } from './lib/createTicket'
import Application from './src/Application'

const context = Nullstack.start(Application) as NullstackServerContext

const issuerId = context.secrets.googleIssuerId
const credentials = JSON.parse(
	readFileSync(context.secrets.googleApplicationCredentials, {
		encoding: 'utf-8',
	}),
)

// TODO: Define Class ID
const classId = `${issuerId}.BASIC_TICKET_001`

const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1'

const httpClient = new GoogleAuth({
	credentials,
	scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
})

async function createPassClass(req, res) {
	// TODO: Create a Generic pass class
	const genericClass = createGoogleClass(classId)

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
			console.log(response)
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

	const genericObject = createGoogleTicket(issuerId, classId, req.body)

	console.log(genericObject)
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
	console.log(saveUrl)

	res.send({ link: `${saveUrl}` })
}

context.server.use(bodyParser.json())

context.server.post('/api/pass/google', async (req, res) => {
	await createPassClass(req, res)
	await createPassObject(req, res)
})

context.start = async function start() {
	// https://nullstack.app/application-startup
}

export default context
