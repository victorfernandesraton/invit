import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import '../tailwind.css'

import { Database } from '../lib/database.types'
import Auth from './auth/index'
import Commitment from './commitment'
import Home from './Home'
import Navbar from './mavbar'
import { PUBLIC_ROUTES } from './mavbar/constants'
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

declare function NotFoundPage(): NullstackNode

class Application extends Nullstack {

  logged = false
  profiles: Profile[] = []

  prepare({ page }: NullstackClientContext) {
    page.locale = 'en-US'
  }

  async hydrate(context: NullstackClientContext<ApplicationProps>) {
    if (this.logged) {
      try {
        this.profiles = await getProfilesQuery(context.database)
        context.profiles = this.profiles
      } catch (error) {
        console.log(error)
      }
    }
  }

  async initiate() {
    await this.update()
  }

  async update(context: NullstackClientContext<ApplicationProps>) {
    if (!PUBLIC_ROUTES.includes(context.router.path)) {
      const { data } = await context.database.auth.getSession()
      this.logged = data?.session?.user?.id
      if (!this.logged) {
        context.router.path = '/auth'
      }
    }
  }

  async logout(context: NullstackClientContext<ApplicationProps>) {
    await context.database.auth.signOut()
    this.logged = false
    context.router.path = '/auth'
  }

  renderNotFoundPage(): NullstackNode {
    return (
      <div>
        <h1>Not found</h1>
      </div>
    )
  }

  render() {
    return (
      <body class="font-mono">
        {this.logged && (
          <Navbar
            logout={this.logout}
            isSuperAdmin={this.profiles.find((p) => p.level === 0)}
            persistent={this.logged}
          />
        )}
        <Home route="/" />
        <Auth route="/auth/*" />
        <Commitment route="/commitment/*" />
        <Tenent route="/tenent/*" />
        <NotFoundPage route="*" />
      </body>
    )
  }

}

export default Application
