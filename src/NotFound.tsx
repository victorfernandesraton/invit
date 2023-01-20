import Nullstack, { NullstackClientContext } from 'nullstack'

class NotFound extends Nullstack {

	prepare(context: NullstackClientContext) {
    context.page.title = 'Not found'
    context.page.changes = 'never'
  }

  render() {
    return (
      <div>
        <h1>Not found</h1>
      </div>
    )
  }

}

export default NotFound