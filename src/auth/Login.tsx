import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'
import { CentralFormContainer } from '../components/centralFrom'

type LoginContext = {
	database: SupabaseClient
}

class Login extends Nullstack {

	email: string = null
	password: string = null
	error: Error | null = null
	loadingLogin = false

	async initiate(context: NullstackClientContext<LoginContext>) {
		const { data } = await context.database.auth.getSession()
		if (data?.session?.user?.id) {
			context.router.path = '/'
		}
	}

	async login({ database }: { database: SupabaseClient }) {
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
      <section class='flex h-screen items-center'>
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
						<div class="flex self-center items-center mb-6">
							<div class="form-group form-check">
								<input
									required
									disabled={this.loadingLogin}
									type="checkbox"
									class="
                  border border-b-4 border-r-4 border-black
                  form-check-input appearance-none h-4 w-4 rounded-sm bg-white checked:bg-pink-600 checked:border-gray-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain mr-2 cursor-pointer"
									id="exampleCheck2"
								/>
								<label class="form-check-label inline-block text-gray-800" for="exampleCheck2">
									Remember me
								</label>
							</div>
						</div>
						<button
							disabled={this.loadingLogin}
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
            ease-in-out"
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
						<div class="mt-6 text-center">
							<a
								href="#!"
								class="text-pink-600 hover:text-pink-700 hover:underline focus:text-pink-700 transition duration-200 ease-in-out"
							>
								Forgot password?
							</a>
						</div>
					</form>
				</CentralFormContainer>
			</section>
		)
	}

}

export default Login
