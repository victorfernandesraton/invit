import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { CentralFormContainer } from '../components/centralFrom'

class Register extends Nullstack {

	email: string = null
	password: string = null
	repeatPassword: string = null
	error: Error | null = null
	loadingLogin = false

	prepare(context: NullstackClientContext) {
		context.page.locale = 'en-US'
		context.page.changes = 'hourly'
		context.page.title = 'Register'
	}

	async signup(context: NullstackClientContext<{ database: SupabaseClient }>) {
		this.loadingLogin = true
		const { error } = await context.database.auth.signUp({
			email: this.email,
			password: this.password,
		})
		this.loadingLogin = false
		if (error) {
			this.error = error
		}
		if (context?.params?.c) {
			context.router.url = `${context.router.base}/commitment/${context.params.c}`
		} else {
			context.router.url = context.router.base
		}
	}

	update() {
		if (this.password) {
			let error
			if (this.password.length < 6) {
				error = new Error('Password must be at least 6 characters')
			} else if (this.password !== this.repeatPassword) {
				error = new Error('Password must be equal')
			}
			this.error = error
		}
	}

	render() {
		return (
			<section class="flex h-screen items-center justify-center">
				<div class="flex px-0 md:w-2/3 lg:w-4/12 sm:w-full sm:px-6 self-center content-center h-full items-center justify-center">
					<CentralFormContainer>
						<form class="flex flex-col">
							<div class="form-group mb-6">
								<label for="exampleInput125" class="form-label inline-block mb-2 text-gray-700">
									Email address
								</label>
								<input
									bind={this.email}
									type="email"
									class="form-control block
        w-full
        px-3
        h-11
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-black border-b-4 border-r-4
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-pink-600 focus:outline-none"
									id="exampleInput126"
									placeholder="Enter Email"
								/>
							</div>
							<div class="form-group mb-6">
								<label for="exampleInput125" class="form-label inline-block mb-2 text-gray-700">
									Passowrd
								</label>
								<input
									bind={this.password}
									type="password"
									class="form-control block
        w-full
        px-3
        h-11
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-black border-b-4 border-r-4
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-pink-600 focus:outline-none"
									id="exampleInput126"
									placeholder="Enter Password"
								/>
							</div>
							<div class="form-group mb-6">
								<label for="repeat" class="form-label inline-block mb-2 text-gray-700">
									Repeat Password
								</label>
								<input
									bind={this.repeatPassword}
									type="password"
									class="form-control block
        w-full
        px-3
        py-1.5
        h-11
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-black border-b-4 border-r-4
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-pink-600 focus:outline-none"
									id="repeat"
									placeholder="Enter Password Again"
								/>
							</div>

							{this.error && (
								<div
									class="
                py-2.5
                px-3
                mb-6
                break-all
                bg-red-500
                text-white
                align-middle
                justify-center
                text-center
                flex
            uppercase
            rounded
            border border-b-4 border-r-4 border-black"
								>
									<p class="break-all">{this.error?.error_description ?? this.error?.message}</p>
								</div>
							)}
							<button
								disabled={!(this.email && !this.error)}
								onclick={this.signup}
								type="submit"
								class="
      w-full
      px-6
      py-2.5
      bg-pink-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      border border-black border-b-4 border-r-4
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
								Sign up
							</button>
							<p class="text-gray-800 mt-6 text-center">
								Have account?{' '}
								<a
									path="/auth/signin"
									class="text-pink-600 hover:text-pink-700 hover:underline focus:text-pink-700 transition duration-200 ease-in-out"
								>
									Sign in
								</a>
							</p>
						</form>
					</CentralFormContainer>
				</div>
			</section>
		)
	}

}

export default Register
