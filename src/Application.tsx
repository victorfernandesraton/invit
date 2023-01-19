import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { PostgrestError, SupabaseClient } from '@supabase/supabase-js'

import '../tailwind.css'

import { Database } from '../lib/database.types'
import Auth from './auth/index'
import Commitment from './commitment'
import Home from './Home'
import Navbar from './mavbar'
import { PUBLIC_ROUTES } from './mavbar/constants'
import NotFound from './NotFound'
import { getProfilesQuery } from './profile/query'
import Tenent from './tenent'

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

declare function Error(props: { error: PostgrestError | Error }): NullstackNode

class Application extends Nullstack {

	logged = false
  profiles: Profile[] = []
  error = null

  prepare(context: NullstackClientContext) {
    context.page.locale = 'en-US'
    context.page.changes = 'hourly'
    context.page.title = 'Invit'
  }

  async hydrate(context: NullstackClientContext<ApplicationProps>) {
    if (this.logged) {
      this.profiles = await getProfilesQuery(context.database)
      try {
      } catch (error) {
        this.error = error
        context.router.url = '/error'
      }
    }
    if (!PUBLIC_ROUTES.includes(context.router.path)) {
      if (!this.logged) {
        context.router.url = '/auth'
      }
    }
  }

  async update(context: NullstackClientContext<ApplicationProps>) {
    const { data } = await context.database.auth.getSession()
    this.logged = !!data?.session?.user?.id
  }

  async logout(context: NullstackClientContext<ApplicationProps>) {
    await context.database.auth.signOut()
    this.logged = false
    localStorage.removeItem('profiles')
    context.router.path = '/auth'
  }

  renderError({ error }: NullstackClientContext<{ error: Error | PostgrestError }>) {
    return <h1>{error?.message}</h1>
  }

  render() {
    return (
      <body class="font-mono">
        {this.logged && (
          <Navbar
            logout={this.logout}
            isSuperAdmin={this.profiles.find((p) => p.level === 0)}
            isManager={this.profiles.find((p) => p.level === 0 || p.tenent_id)}
            persistent={this.logged}
          />
        )}
        <main>
          <Home route="/" />
          <Auth route="/auth/*" />
          <Commitment route="/commitment/*" />
          <Tenent route="/tenent/*" />
          <Error route="/error" error={this.error} />
          <NotFound route="*" />
        </main>
      </body>
    )
  }

}

export default Application
