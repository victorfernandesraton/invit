import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import Dropdown from '../components/dropdown'
import { ADMIN_ROUTE, PRIVATE_RUTE } from './constants'

type LogoutCallback = () => void

type Props = {
  logout: LogoutCallback
  isSuperAdmin: boolean
  isManager: boolean
}

type NavItemProps = {
  title: string
  url: string
  current?: boolean
}

declare function NavItem(props: NavItemProps): NullstackNode
declare function SideMenu(props: { logout: LogoutCallback }): NullstackNode
declare function MobileMenu(): NullstackNode

class Navbar extends Nullstack {

	toggle = false
  toggleTenent = false

  changeToggle() {
    this.toggle = !this.toggle
  }

  changeToggleTenent() {
    this.toggleTenent = !this.toggleTenent
  }

  renderNavItem({ url, title }: NavItemProps) {
    return (
      <li class="nav-item px-2">
        <a class="nav-link text-black p-0" href={url}>
          {title}
        </a>
      </li>
    )
  }

  renderSideMenu({ logout }: { logout: LogoutCallback }) {
    return (
      <div class="dropdown relative ml-2">
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
            list-none
            text-left
            mt-1
            m-0
            bg-clip-padding
            border-black
            border-2
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
                text-black
                hover:bg-amber-100
              "
              onclick={logout}
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    )
  }

  renderMobileMenu() {
    return (
      <div class="md:hidden">
        <Dropdown
          options={PRIVATE_RUTE}
          header={
            <>
              <div
                class="md:hidden flex items-center
                      mr-2
                      border
                      border-pink-600 border-r-2 border-b-2
                      hover:border-black
                      hover:bg-pink-700
                      h-8
                      "
              >
                <button class="outline-none mobile-menu-button">
                  <svg
                    class="w-6 h-6 text-pink-700 hover:text-black"
                    x-show="!showMenu"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </>
          }
        />
      </div>
    )
  }

  render({ logout, isSuperAdmin = false, isManager = false }: NullstackClientContext<Props>) {
    return (
      <nav class="relative w-full flex flex-wrap items-center justify-between py-3 bg-white text-gray-500 hover:text-gray-700 focus:text-gray-700 border-black border-2">
        <div class="container-fluid w-full flex  items-center justify-between px-6">
          <div class="container-fluid flex w-full gap-2">
            <a href="/" class="text-xl text-black self-center uppercase">
              Invite
            </a>

            <div class="flex">
              <MobileMenu />
            </div>

            <ul class="hidden md:flex navbar-nav flex-row pl-2 list-style-none self-center">
              {isSuperAdmin && (
                <>
                  {ADMIN_ROUTE.map((item) => (
                    <NavItem {...{ ...item }} />
                  ))}
                </>
              )}
              {isManager && (
                <>
                  {PRIVATE_RUTE.map((item) => (
                    <NavItem {...{ ...item }} />
                  ))}
                </>
              )}
            </ul>

            <div class="flex items-center justify-end align-bottom self-center w-full">
              <SideMenu logout={logout} />
            </div>
          </div>
        </div>
      </nav>
    )
  }

}

export default Navbar
