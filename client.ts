import Nullstack, { NullstackClientContext } from 'nullstack'

import { createClient } from '@supabase/supabase-js'

import { Database } from './lib/database.types'
import { getProfilesQuery } from './src/adm/profile/query'
import Application from './src/Application'
import { PUBLIC_ROUTES } from './src/mavbar/constants'
import { ApplicationProps } from './src/types'

const context = Nullstack.start(Application) as NullstackClientContext<ApplicationProps>

context.start = async function start({ settings }: NullstackClientContext<ApplicationProps>) {
	const database = createClient<Database>(settings.supabaseApiUrl, settings.supabaseRoleKey, {
		db: {
			schema: 'public',
		},
	})
	context.database = database
	context.auth = undefined
	const { data } = await context.database.auth.getSession()

	if (data.session) {
		const profiles = await getProfilesQuery(context.database)
		context.auth = {
			session: data.session,
			superAdmin: !!profiles.find((p) => p.level === 0),
			manager: !!profiles.find((p) => p.level === 0 || p.tenent_id),
		}
	}

	if (!PUBLIC_ROUTES.find((item) => context.router.path.includes(item))) {
		if (!context.auth?.session) {
			context.router.url = '/auth'
		}
	}
}

export default context
