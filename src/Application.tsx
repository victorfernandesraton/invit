import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import '../tailwind.css'

import Auth from './auth/index'
import Commitment from './commitment'
import Home from './Home'
import Navbar from './mavbar'
import { PUBLIC_ROUTES } from './mavbar/constants'

type ApplicationProps = {
  database: SupabaseClient
}

class Application extends Nullstack {

  logged = false

  prepare({ page }: NullstackClientContext) {
    page.locale = 'en-US'
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

  render() {
    return (
      <body class="font-mono">
        {this.logged && <Navbar logout={this.logout} />}
        <Home route="/" />
        <Auth route="/auth/:slug" />
        <Commitment route="/commitment/:slug" />
      </body>
    )
  }

}

export default Application
