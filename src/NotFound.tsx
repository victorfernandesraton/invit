import Nullstack, { NullstackClientContext } from 'nullstack'

class NotFound extends Nullstack {

	prepare(context: NullstackClientContext) {
		context.page.title = 'Not found'
		context.page.changes = 'always'
		// context.page.status = 404
	}

	render() {
		return (
			<div class="flex py-20 justify-center">
				<h1>Not found</h1>
			</div>
		)
	}

}

export default NotFound
