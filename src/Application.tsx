import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { PostgrestError } from '@supabase/supabase-js'

import '../tailwind.css'

import Adm from './adm'
import Wallet from './adm/wallet'
import Auth from './auth/index'
import Commitment from './commitment'
import Home from './Home'
import Navbar from './mavbar'
import NotFound from './NotFound'
import { ApplicationProps } from './types'

declare function Error(props: { error?: PostgrestError | Error }): NullstackNode

class Application extends Nullstack {

	error = null

	prepare(context: NullstackClientContext) {
		context.page.locale = 'en-US'
		context.page.changes = 'hourly'
		context.page.title = 'Invit'
	}

	renderError({ error }: NullstackClientContext<{ error?: Error | PostgrestError }>) {
		return <h1>{error?.message ?? 'Unexpected Error'}</h1>
	}

	render({ page, router, auth }: NullstackClientContext<ApplicationProps>) {
		if (!this.hydrated) {
			return <main>Loading...</main>
		}
		if (page.status !== 200) {
			return (
				<main>
					<Error route="/error" />
				</main>
			)
		}
		return (
			<body class="font-mono">
				{auth?.session && <Navbar id={auth?.session?.user?.id} />}
				<div>
					<Home route="/" />
					<Auth route="/auth/*" />
					<Adm route="/adm/*" />
					<Commitment route="/commitment/*" />
					<Wallet route="/wallet/*" />
					<Error route="/error" error={this.error} />
					<NotFound route="*" />
				</div>
				{!auth?.session && !router.path.includes('/auth') && (
					<footer class="fixed-bottom w-full bg-white border-black border-2">
						<div class="flex justify-center gap-2">
							<p>Have account?</p>
							<a href="/auth" class="text-pink-600 underline">
								Sign in
							</a>
						</div>
					</footer>
				)}
			</body>
		)
	}

}

export default Application
