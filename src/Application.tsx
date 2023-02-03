import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { PostgrestError, SupabaseClient } from '@supabase/supabase-js'

import '../tailwind.css'

import { Database } from '../lib/database.types'
import Adm from './adm'
import { getProfilesQuery } from './adm/profile/query'
import Wallet from './adm/wallet'
import Auth from './auth/index'
import Commitment from './commitment'
import Home from './Home'
import Navbar from './mavbar'
import { PUBLIC_ROUTES } from './mavbar/constants'
import NotFound from './NotFound'

type TenentType = {
	id: string
	name: string
}

export type Profile = Database['public']['Tables']['profile']['Row'] & {
	tenent?: TenentType
}

type ApplicationProps = {
	database: SupabaseClient
	profiles: Profile[]
}

declare function Error(props: { error?: PostgrestError | Error }): NullstackNode

class Application extends Nullstack {

	logged = false
	profiles: Profile[] = []
	error = null
	user = null

	prepare(context: NullstackClientContext) {
		context.page.locale = 'en-US'
		context.page.changes = 'hourly'
		context.page.title = 'Invit'
	}

	async hydrate(context: NullstackClientContext<ApplicationProps>) {
		const { data } = await context.database.auth.getSession()
		this.user = data
		this.logged = !!data?.session?.user?.id
		this.profiles = await getProfilesQuery(context.database)
		if (!PUBLIC_ROUTES.find((item) => context.router.path.includes(item))) {
			if (!this.logged) {
				context.router.url = '/auth'
			}
		}
	}

	async logout(context: NullstackClientContext<ApplicationProps>) {
		await context.database.auth.signOut()
		this.logged = false
		localStorage.removeItem('profiles')
		context.router.path = '/auth'
	}

	renderError({ error }: NullstackClientContext<{ error?: Error | PostgrestError }>) {
		return <h1>{error?.message ?? 'Unexpected Error'}</h1>
	}

	render({ page, router }: NullstackClientContext) {
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
				{this.logged && (
					<Navbar
						id={this.user.id}
						logout={this.logout}
						isSuperAdmin={this.profiles.find((p) => p.level === 0)}
						isManager={this.profiles.find((p) => p.level === 0 || p.tenent_id)}
					/>
				)}
				<div>
					<Home route="/" />
					<Auth route="/auth/*" />
					<Adm route="/adm/*" />
					<Commitment route="/commitment/*" />
					<Wallet route="/wallet/*" />
					<Error route="/error" error={this.error} />
					<NotFound route="*" />
				</div>
				{!this.logged && !router.path.includes('/auth') && (
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
