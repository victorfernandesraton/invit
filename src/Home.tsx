import Nullstack, { NullstackClientContext } from 'nullstack'

class Home extends Nullstack {

  prepare({ project, page, greeting }: NullstackClientContext) {
    page.title = `${project.name} - ${greeting}`
    page.description = `${project.name} was made with Nullstack`
  }

  render() {
    return <section class="" />
  }

}

export default Home
