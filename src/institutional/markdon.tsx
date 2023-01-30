import Nullstack, { NullstackClientContext } from 'nullstack'

import { readFileSync } from 'node:fs'
import { Remarkable } from 'remarkable'

type Props = {
  name: string
}

class Markdon extends Nullstack<Props> {

  html = null

  static async getFileRender({ request }) {
    const data = readFileSync(`./src/institutional/${request.filename}.md`, 'utf-8')

    return data
  }

  async initiate({ name }: NullstackClientContext<Props>) {
    const md = new Remarkable('full')
    md.renderer.rules.heading_open = function (token, idx) {
      const itemClass = ['2xl', 'xl', 'lg']

      if (token[idx].level <= 2) {
        return `<h${token[idx].hLevel} class="text-${itemClass[token[idx].level]}">`
      }
    }
    const data = await this.getFileRender({
      request: {
        filename: name.toLowerCase(),
      },
    })

    this.html = md.render(data)
  }

  render({ name }: NullstackClientContext<Props>) {
    return (
      <details class="flex duration-300">
        <summary class="bg-inherit text-3xl cursor-pointer capitalize">{name}</summary>

        <article class="h-fit mt-2" html={this.html} />
      </details>
    )
  }

}

export default Markdon
