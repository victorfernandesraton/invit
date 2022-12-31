import Nullstack from 'nullstack'

import Login from './Login'
import Register from './Register'

class index extends Nullstack {

  async initiate(context: NullstackClientContext<ApplicationProps>) {
    const {
      data: { session },
    } = await context.database.auth.getSession()
    if (session?.user?.id) {
      context.router.url = '/'
    }
  }

  render() {
    return (
      <main>
        <Login route="/auth" />
        <Login route="/auth/signin" />
        <Register route="/auth/signup" />
      </main>
    )
  }

}

export default index
