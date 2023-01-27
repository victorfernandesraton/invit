import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { getProfilesQuery } from '../adm/profile/query'
import { CentralFormContainer } from '../components/centralFrom'

type LoginContext = {
  database: SupabaseClient
}

class Login extends Nullstack {

	email: string = null
  password: string = null
  error: Error | null = null
  loadingLogin = false

  prepare(context: NullstackClientContext) {
    context.page.locale = 'en-US'
    context.page.changes = 'hourly'
    context.page.title = 'Login'
  }

  async initiate(context: NullstackClientContext<LoginContext>) {
    const { data } = await context.database.auth.getSession()
    if (data?.session?.user?.id) {
      await getProfilesQuery(context.database)
      if (context?.params?.c) {
        context.router.url = `/commitment/${context.params.c}`
      } else {
        context.router.url = `/`
      }
    }
  }

  async login({ database }: NullstackClientContext<{ database: SupabaseClient }>) {
    this.loadingLogin = true
    const { error } = await database.auth.signInWithPassword({
      email: this.email,
      password: this.password,
    })

    this.loadingLogin = false
    if (error) {
      this.error = error
    } else {
      this.initiate()
    }
  }

  render() {
    return (
      <section class="flex h-screen items-center justify-center">
        <div class="flex px-0 md:w-2/3 lg:w-3/12 sm:w-full sm:px-6 self-center content-center h-full items-center justify-center">
          <CentralFormContainer>
            <form>
              <div class="form-group mb-6">
                <label for="exampleInputEmail2" class="form-label inline-block mb-2 text-gray-700">
                  Email address
                </label>
                <input
                  bind={this.email}
                  type="email"
                  class="form-control
              block
              h-11
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
               border border-b-4 border-r-4 border-black
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-pink-600 focus:outline-none"
                  id="exampleInputEmail2"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                />
              </div>
              <div class="form-group mb-6">
                <label for="exampleInputPassword2" class="form-label inline-block mb-2 text-gray-700">
                  Password
                </label>
                <input
                  bind={this.password}
                  required
                  type="password"
                  disabled={this.loadingLogin}
                  class="form-control block
                                
              w-full
              px-3
              py-1.5
              h-11
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
               border border-b-4 border-r-4 border-black
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-pink-600 focus:outline-none"
                  id="exampleInputPassword2"
                  placeholder="Password"
                />
              </div>
              <button
                disabled={this.loadingLogin || !this.email || this?.password?.length < 6}
                onclick={this.login}
                type="submit"
                class="
            w-full
            px-6
            py-2.5
            mb-6
            bg-pink-600
            text-white
            font-medium
            text-xs
            leading-tight
            uppercase
            rounded
            border border-b-4 border-r-4 border-black
            hover:bg-white hover:text-pink-700 hover:border-pink-700
            transition
            duration-150
            ease-in-out
						disabled:bg-pink-400
						disabled:text-white
						disabled:border-gray-500
						disabled:cursor-not-allowed
						"
              >
                Sign in
              </button>
              {this.error && (
                <div
                  class="
                py-2.5
                px-3
                bg-red-500
                text-white
                align-middle
                justify-center
                text-center
            uppercase
            rounded
            border border-b-4 border-r-4 border-black
"
                >
                  <p>{this.error?.error_description ?? this.error?.message}</p>
                </div>
              )}
              <p class="text-gray-800 mt-6 text-center">
                Not a member?{' '}
                <a
                  path="/auth/signup"
                  class="text-pink-600 hover:text-pink-700 hover:underline focus:text-pink-700 transition duration-200 ease-in-out"
                >
                  Register
                </a>
              </p>
            </form>
          </CentralFormContainer>
        </div>
      </section>
    )
  }

}

export default Login
