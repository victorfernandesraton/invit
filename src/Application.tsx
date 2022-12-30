import Nullstack, { NullstackClientContext } from 'nullstack'

import '../tailwind.css'
import Home from './Home'

class Application extends Nullstack {

  prepare({ page }: NullstackClientContext) {
    page.locale = 'en-US'
  }

  render() {
    return (
      <body class="">
        <Home route="/" />
      </body>
    )
  }

}

export default Application
