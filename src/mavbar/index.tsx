import Nullstack from 'nullstack'

type Props = {
  logout: () => void
}

class Navbar extends Nullstack<Props> {

  toggle = false

  changeToggle() {
    this.toggle = !this.toggle
  }

  render({ logout }: Props) {
    return (
      <nav class="relative w-full flex flex-wrap items-center justify-between py-3 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg">
        <div class="container-fluid w-full flex flex-wrap items-center justify-between px-6">
          <div class="container-fluid flex">
            <a class="text-xl text-black self-center" href="#">
              Navbar
            </a>
            <ul class="navbar-nav flex flex-row pl-2 list-style-none self-center">
              <li class="nav-item px-2">
                <a class="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li class="nav-item pr-2">
                <a class="nav-link text-gray-500 hover:text-gray-700 focus:text-gray-700 p-0" href="#">
                  Features
                </a>
              </li>
              <li class="nav-item pr-2">
                <a class="nav-link text-gray-500 hover:text-gray-700 focus:text-gray-700 p-0" href="#">
                  Pricing
                </a>
              </li>
              <li class="nav-item pr-2">
                <a class="nav-link disabled text-gray-300 p-0">Disabled</a>
              </li>
            </ul>

            <div class="flex items-center relative justify-end align-bottom self-center">
              <div class="dropdown relative">
                <button
                  class="
                text-black
                border border-black border-r-2 border-b-2
                mr-4
                p-2
                dropdown-toggle
                hidden-arrow
                flex
                hover:bg-pink-600
                justify-center
                items-center
                align-middle
              "
                  onclick={this.changeToggle}
                  id="dropdownMenuButton1"
                  role="button"
                  aria-expanded="false"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="bell"
                    class="w-4 h-4 justify-center align-middle items-center"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                    />
                  </svg>
                </button>
                <ul
                  class={`
            dropdown-menu
            min-w-max
            absolute
            bg-white
            text-base
            z-50
            float-left
            py-2
            list-none
            text-left
            rounded-lg
            shadow-lg
            mt-1
            m-0
            bg-clip-padding
            border-none
            left-auto
            right-0
            text-
            ${!this.toggle ? 'hidden' : ''}
          `}
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a
                      class="
                dropdown-item
                text-sm
                py-2
                px-4
                font-normal
                block
                w-full
                whitespace-nowrap
                bg-transparent
                text-gray-700
                hover:bg-gray-100
              "
                      onclick={logout}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

}

export default Navbar
