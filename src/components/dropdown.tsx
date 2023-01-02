import Nullstack from 'nullstack'

export type DropdownOption = {
  title: string
  url?: string
  current?: boolean
}

export type CallbackDropdown = (option: DropdownOption) => void

type DropdownOptionItem = DropdownOption & { callback?: CallbackDropdown }
type Props = {
  title?: string
  header?: HTMLElement
  options: DropdownOption[]
  callback?: CallbackDropdown
}

class Dropdown extends Nullstack {

  toggle = false
  changeToggle() {
    this.toggle = !this.toggle
  }

  renderOptionItem({ title, url, callback, current }: DropdownOptionItem) {
    return (
      <li>
        <a
          class="
            border-2
            border-black
            dropdown-item
            text-md
            py-2
            px-4
            font-normal
            block
            bg-transparent
            text-black
            hover:bg-amber-100
            "
          onclick={() => {
            if (callback) {
              callback({ title, url, current })
            }
            this.toggle = false
          }}
          href={url}
        >
          {title}
        </a>
      </li>
    )
  }

  renderNavTitle({ children }) {
    return (
      <button
        class="
        dropdown-toggle
        px-6
        py-2.5
        bg-pink-600
        text-white
        font-medium
        text-xs
        leading-tight
        uppercase
        rounded
        border-2
        border-black
        hover:bg-white hover:text-pink-700 hover:border-pink-700
        focus:bg-white focus:text-pink-700 focus:border-pink-700
        active:bg-white active:text-pink-700 active:border-pink-700
        transition
        duration-150
        ease-in-out
        flex
        items-center
        whitespace-nowrap
        w-full
      "
        type="button"
        id="dropdownMenuButton1"
        onclick={this.changeToggle}
        aria-expanded="false"
      >
        {children}
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="caret-down"
          class="w-2 ml-2"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
          />
        </svg>
      </button>
    )
  }

  render({ header, title, options, callback }: Props) {
    return (
      <div>
        <div class="dropdown relative">
          {title && <NavTitle>{title}</NavTitle>}
          {header && <button onclick={this.changeToggle}>{header}</button>}
          <ul
            class={`
            dropdown-menu
            min-w-max
            absolute
            bg-white
            text-base
            z-50
            float-left
            list-none
            text-left
            mt-1
            m-0
            bg-clip-padding
            left-auto
            right-0
            text-
            ${!this.toggle ? 'hidden' : ''}
            `}
            aria-labelledby="dropdownMenuButton1"
          >
            {options.map((item) => (
              <OptionItem {...{ ...item, callback }} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

}

export default Dropdown
