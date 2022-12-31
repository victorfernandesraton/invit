import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import '../tailwind.css'

import Auth from './auth/index'
import Home from './Home'

type ApplicationProps = {
  database: SupabaseClient
}

class Application extends Nullstack {

  logged = false
  prepare({ page }: NullstackClientContext) {
    page.locale = 'en-US'
  }

  async update(context: NullstackClientContext<ApplicationProps>) {
    const { data } = await context.database.auth.getSession()
    this.logged = data?.session?.user?.id
    if (!this.logged) {
      context.router.path = '/auth'
    }
  }

  async logout(context: NullstackClientContext<ApplicationProps>) {
    await context.database.auth.signOut()
    this.logged = false
    context.router.path = '/auth'
  }

  renderNav() {
    return <buttom onclick={this.logout}>Logout</buttom>
  }

  render() {
    return (
      <body class="font-mono">
        {this.logged && <Nav />}
        <Home route="/" />
        <Auth route="/auth/:slug" />
      </body>
    )
  }

}

export default Application
