import Nullstack, { NullstackClientContext } from 'nullstack'

import { Database } from '../../lib/database.types'
import { CentralFormContainer } from '../components/centralFrom'

type Tenent = {
  id: string
  name: string
}

type BillingFormProps = {
  type: 'Create' | 'Edit'
}

abstract class BillingForm extends Nullstack {

	billing: Database['public']['Tables']['billing']['Row'] = null
  commitment: {
    currency: string
    id: string
  } = null

  tenents: Tenent[] = []
  error = null
  deleted = false
  description = null
  remote = true
  currency = null
  price = null

  result: Database['public']['Tables']['billing']

  abstract initiate(context: NullstackClientContext)

  abstract submit(context: NullstackClientContext)

  render({ type = 'Create' }: NullstackClientContext<BillingFormProps>) {
    if (!this.initiated) {
      return <>Loading</>
    }
    return (
      <section class="flex justify-center">
        <div class="flex px-0 md:w-2/3 lg:w-2/6 sm:w-full sm:px-6 self-center content-center h-full mt-12 items-center justify-center">
          <CentralFormContainer title={`${type} billig`}>
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
              <div class=" flex-col flex-wrap">
                <label for="price" class="form-label inline-block mb-2 text-gray-700 capitalize">
                  price
                </label>
                <div class="flex flex-row space-x-2">
                  <input
                    type="number"
                    id="price"
                    min="0"
                    step="0.01"
                    required
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
                    placeholder="Enter price"
                  />
                  <select
                    disabled
                    value={this.commitment.currency}
                    class="form-select form-select-lg mb-3
      appearance-none
      block
      w-3/6
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
            {this.deleted && (
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
                Sucess on delete content
                <p />
              </div>
            )}
          </CentralFormContainer>
        </div>
      </section>
    )
  }

}

export default BillingForm
