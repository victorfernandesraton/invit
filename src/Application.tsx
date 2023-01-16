import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import '../tailwind.css'

import { Database } from '../lib/database.types'
import Auth from './auth/index'
import Commitment from './commitment'
import Home from './Home'
import Navbar from './mavbar'
import { PUBLIC_ROUTES } from './mavbar/constants'

type Tenent = {
  id: string
  name: string
}

export type Profile = Database['public']['Tables']['profile']['Row'] & {
  tenent?: Tenent
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
      const { data: profile, error: errorProfile } = await context.database
        .from('profile')
        .select('*, tenent (name, id), level')
        .neq('status', 0)
        .neq('tenent.status', 0)

      if (!errorProfile) {
        context.profiles = profile
        this.profiles = profile;
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
        {this.logged && <Navbar logout={this.logout} isSuperAdmin={this.profiles.find(p => p.level === 0)} />}
        <Home route="/" />
        <Auth route="/auth/*" />
        <Commitment route="/commitment/*" />
        <NotFoundPage route="*" />
      </body>
    )
  }

}

export default Application
