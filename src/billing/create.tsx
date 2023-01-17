import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'
import { Profile } from '../Application'
import { getCommitmentById } from '../commitment/query'
import { CentralFormContainer } from '../components/centralFrom'
import { getProfilesQuery } from '../profile/query'

type CreateBillingContext = {
  database: SupabaseClient
  profiles: Profile[]
}

type Tenent = {
  id: string
  name: string
}

class CreateBilling extends Nullstack {

	commitment: Database['public']['Tables']['commitment']['Row'] = null
  tenents: Tenent[] = []
  error = null

  description = null
  remote = true
  currency = null
  price = null

  result: Database['public']['Tables']['billing']

  async initiate(context: NullstackClientContext<CreateBillingContext>) {
    try {
      const profiles = await getProfilesQuery(context.database)

      this.tenents = profiles.filter((item) => item.tenent_id).map((item) => item.tenent)
      this.commitment = await getCommitmentById({
        database: context.database,
        commitmentId: context.params.slug.toString(),
        profiles,
      })
    } catch (error) {
      this.error = error
    }

    if (!this.commitment) {
      context.router.url = '/404'
    }
  }

  async submit({ database }: CreateBillingContext) {
    const { data, error } = await database
      .from('billing')
      .insert<Database['public']['Tables']['billing']['Insert']>({
        commitment_id: this.commitment.id,
        description: this.description,
        currency: this.currency,
        price: this.price,
        remote: this.remote,
      })
      .select('*')

    this.error = error
    this.result = data?.[0]
  }

  render() {
    return (
      <section class="flex w-screen h-screen items-center">
        <CentralFormContainer title="Create Billing">
          <form onsubmit={this.submit}>
            <div class="flex justify-center flex-col">
              <div class="form-group mb-6">
                <label for="description" class="form-label inline-block mb-2 text-gray-700 capitalize">
                  description
                </label>
                <input
                  id="description"
                  bind={this.description}
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
                  placeholder="Enter description"
                  required
                />
              </div>
            </div>
            <div class="form-group mb-6">
              <label for="currency" class="form-label inline-block mb-2 text-gray-700 capitalize">
                Currency
              </label>
              <div class="flex flex-row form-group">
                <input
                  id="currency"
                  name="currency"
                  bind={this.price}
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
                  placeholder="Enter currency value"
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                />
                <select
                  bind={this.currency}
                  class="form-select form-select-lg mb-3
      appearance-none
      block
      w-1/3
      px-3
      py-1.5
      text-xl
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-b-4 border-r-4 border-black
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-pink-600 focus:outline-none"
                  aria-label=".form-select-lg example"
                >
                  <option selected value="BRL">
                    BRL
                  </option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div class="form-group mb-6 flex flex-row space-x-2 justify-between">
              <label class="form-check-label inline-block text-gray-800 text-lg" for="enableDateEnd">
                Remote evemt
              </label>
              <div class="form-check form-switch">
                <input
                  bind={this.remote}
                  class="form-check-input appearance-none w-9 rounded-full float-left h-5 align-top  bg-no-repeat focus:outline-none cursor-pointer
                    border border-black border-r-2 border-b-2
                    bg-pink-300
                    checked:bg-pink-600
                    checked:border-black
                    "
                  type="checkbox"
                  role="switch"
                  id="enableDateEnd"
                />
              </div>
            </div>
            <button
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
              Submit
            </button>
          </form>
          {this.result && (
            <div
              class="
                py-2.5
                px-3
                bg-green-500
                text-white
                align-middle
                justify-center
                text-center
            uppercase
            rounded
            border border-b-4 border-r-4 border-black
"
            >
              Sucess go to billing page{' '}
              <a
                class="text-pink-600 hover:text-pink-700 hover:underline focus:text-pink-700 transition duration-200 ease-in-out"
                href={`/commitment/${this.commitment.id}/billing`}
              >
                Here
              </a>
              <p />
            </div>
          )}
        </CentralFormContainer>
      </section>
    )
  }

}

export default CreateBilling
