import Nullstack from 'nullstack'

import Login from './Login'

class index extends Nullstack {

  render() {
    return (
      <main>
        <Login route="/auth/signin" />
      </main>
    )
  }

}

export default index
