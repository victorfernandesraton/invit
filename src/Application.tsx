import Nullstack, { NullstackClientContext } from 'nullstack'

import '../tailwind.css'

import Auth from './auth/index'
import Home from './Home'

class Application extends Nullstack {

  prepare({ page }: NullstackClientContext) {
    page.locale = 'en-US'
  }

  render() {
    return (
      <body class="">
        <Home route="/" />
        <Auth route="/auth/:slug" />
      </body>
    )
  }

}

export default Application
