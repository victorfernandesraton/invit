import Nullstack, { NullstackClientContext } from 'nullstack'

class Home extends Nullstack {

  prepare(context: NullstackClientContext) {
    context.page.title = "Invit - Home"
  }

  render() {
    return <section class="" />
  }

}

export default Home
