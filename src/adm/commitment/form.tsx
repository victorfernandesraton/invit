import Nullstack, { NullstackClientContext } from 'nullstack'

import { Database } from '../../../lib/database.types'
import { parseDateToDefaultString } from '../../../lib/utils/date'
import { CentralFormContainer } from '../../components/centralFrom'

type Tenent = {
  id: string
  name: string
}

type CommitmentFormProps = {
  type: 'Create' | 'Edit'
}

abstract class CommitmentForm extends Nullstack {

	commitment: Database['public']['Tables']['commitment']["Row"] = null
  deleted = false
  tenent = null
  tenents: Tenent[] = []
  loadingSubmit = false
  showEndAt = null
  title = null
  description = null
  startAt: Date = null
  endAt: Date = null
  currency = 'BRL'
  error = null
  result: Database['public']['Tables']['commitment']['Row'] = null

  update() {
    if (!this.showEndAt) {
      this.endAt = null
    }
  }

  abstract submit(context: NullstackClientContext): void

  abstract initiate(context: NullstackClientContext): void

  abstract delete(context: NullstackClientContext): void

  render({ type = 'Create' }: NullstackClientContext<CommitmentFormProps>) {
    if (!this.initiated) {
      return <>Loading</>
    }

    if (type === 'Edit') {
      if (this.initiated && !this.commitment) {
        return <h1>Not found</h1>
      }
    }

    return (
      <section class="flex justify-center">
        <div class="flex px-0 md:w-2/3 lg:w-2/6 sm:w-full sm:px-6 self-center content-center h-full mt-12 items-center justify-center">
          <CentralFormContainer title={`${type} commitment`}>
            <form onsubmit={this.submit}>
              <div class="flex justify-center flex-col">
                {this.tenents.length > 1 && (
                  <div class="form-group mb-6">
                    <label for="tenent" class="form-label inline-block mb-2 text-gray-700">
                      Tenent
                    </label>
                    <select
                      name="tenent"
                      id="tenent"
                      bind={this.tenent}
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
                      required
                    >
                      {this.tenents.map((tenetOption) => (
                        <option value={tenetOption.id}>{tenetOption.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div class="form-group mb-6">
                  <label for="title" class="form-label inline-block mb-2 text-gray-700">
                    Title
                  </label>
                  <input
                    id="title"
                    bind={this.title}
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
                    aria-describedby="titleHelp"
                    placeholder="Enter title"
                    required
                  />
                </div>
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
                    aria-describedby="descriptionHelp"
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div class="form-group mb-6">
                  <label for="startAt" class="form-label inline-block mb-2 text-gray-700">
                    Start at
                  </label>
                  <input
                    aria-describedby="dateHelp"
                    type="datetime-local"
                    id="startAt"
                    name="startAt"
                    required
                    min={parseDateToDefaultString(new Date())}
                    bind={this.startAt}
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
                  />
                </div>
                <div class="flex form-group mb-6">
                  <div class="form-check form-switch">
                    <input
                      bind={this.showEndAt}
                      class="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top  bg-no-repeat focus:outline-none cursor-pointer
                    border border-black border-r-2 border-b-2
                    bg-pink-300
                    checked:bg-pink-600
                    checked:border-black
                    "
                      type="checkbox"
                      role="switch"
                      id="enableDateEnd"
                    />
                    <label class="form-check-label inline-block text-gray-800" for="enableDateEnd">
                      Enable date to end commitment
                    </label>
                  </div>
                </div>
                {this.showEndAt && (
                  <div class="form-group mb-6">
                    <label for="endAt" class="form-label inline-block mb-2 text-gray-700">
                      End at
                    </label>
                    <input
                      bind={this.endAt}
                      required={this.showEndAt}
                      min={
                        this.startAt
                          ? parseDateToDefaultString(new Date(this.startAt))
                          : parseDateToDefaultString(new Date())
                      }
                      aria-describedby="dateHelp"
                      type="datetime-local"
                      id="endAt"
                      name="endAt"
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
                    />
                  </div>
                )}
                <div class="form-group mb-6">
                  <label for="currency" class="form-label inline-block mb-2 text-gray-700 capitalize">
                    Currency
                  </label>
                  <div class="flex flex-row form-group">
                    <select
                      bind={this.currency}
                      class="form-select form-select-lg mb-3
      appearance-none
      block
			w-full
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
                      <option value="BRL">BRL</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
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
              {type === 'Edit' && (
                <button
                  onclick={this.delete}
                  class="
            w-full
            px-6
            py-2.5
            mb-6
            bg-red-600
            text-white
            font-medium
            text-xs
            leading-tight
            uppercase
            rounded
            border border-b-4 border-r-4 border-black
            hover:bg-white hover:text-red-700 hover:border-red-700
            transition
            duration-150
            ease-in-out"
                >
                  Delete
                </button>
              )}
            </form>
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
                <p>Error on create commitment</p>
              </div>
            )}
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
                Sucess go to commitment page{' '}
                <a
                  class="text-pink-600 hover:text-pink-700 hover:underline focus:text-pink-700 transition duration-200 ease-in-out"
                  href={`/adm/commitment/${this.result.id}`}
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

export default CommitmentForm
