import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'
import { parseDateToDefaultString, parseDateToUTCString } from '../../lib/utils/date'

type EditCommitmentContext = {
  database: SupabaseClient
}

type Tenent = {
  id: string
  name: string
}

class EditCommitment extends Nullstack {

  commitment: Database['public']['Tables']['commitment']["Row"] = null
  loading = false
  error = null
  tenents: Tenent[] = []
  tenent = null
  loadingSubmit = false
  showEndAt = null
  title = null
  description = null
  startAt: Date = null
  endAt: Date = null
  result: Database['public']['Tables']['commitment']['Row'] = null

  _setFormValues(commitment) {
    this.title = commitment.title
    this.description = commitment.description
    this.startAt = new Date(commitment.start_at)
    this.showEndAt = commitment?.end_at ?? false
    this.endAt = new Date(commitment?.end_at)
    this.tenent = this.tenents.find((t) => t.id === commitment.tenent_id)
  }

  async initiate({ database, params }: NullstackClientContext<EditCommitmentContext>) {
    this.loading = true
    const { data: profile, error: errorProfile } = await database
      .from('profile')
      .select('tenent (name, id), id')
      .neq('status', 0)
      .neq('tenent.status', 0)
    this.error = errorProfile
    if (!this.error) {
      this.tenents = profile.map((item) => item.tenent)
      const { data: commitment, error: commitmentError } = await database
        .from('commitment')
        .select('*')
        .in(
          'tenent_id',
          this.tenents.map((item) => item.id),
        )
        .eq('id', params.slug)

      this.error = commitmentError
      this.commitment = commitment[0]
      this._setFormValues(commitment[0])
    }
    this.loading = false
  }

  async submit({ database }: NullstackClientContext<EditCommitmentContext>) {
    const { data, error } = await database
      .from('commitment')
      .update<Database['public']['Tables']['commitment']['Update']>({
        title: this.title,
        start_at: this.startAt,
        description: this.description,
        end_at: this.endAt ?? null,
        tenent_id: this.tenent.id,
      })
      .eq('id', this.commitment.id)
      .select('*')

    this.error = error
    this.result = data[0]
    this.commitment = data[0]
    this._setFormValues(data[0])
  }

  update() {
    if (!this.showEndAt) {
      this.endAt = null
    }
  }

  render() {
    if (!this.initiated) {
      return <>Loading</>
    }
    return (
      <div class="mt-12 align-middle flex justify-center h-full">
        <div class="h-1/3 content-center flex flex-col p-6 rounded-lg bg-amber-100 max-w-md border border-black border-b-4 border-r-4">
          <h1 class="text-xl md:text-2xl py-2">Edit commitment</h1>
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
                  min={parseDateToDefaultString(new Date())}
                  value={parseDateToUTCString(this.startAt)}
                  onchange={({ event }) => {
                    this.startAt = new Date(event.target.value)
                  }}
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
              <div class="flex justify-center form-group mb-6">
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
                    required={this.showEndAt}
                    aria-describedby="dateHelp"
                    type="datetime-local"
                    id="endAt"
                    name="endAt"
                    min={this.startAt ? parseDateToDefaultString(new Date(this.startAt)) : undefined}
                    value={this?.endAt?.toISOString?.().split('.')[0]}
                    onchange={({ event }) => {
                      this.endAt = new Date(event.target.value)
                    }}
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
              Sucess to update{' '}
              <a
                class="text-pink-600 hover:text-pink-700 hover:underline focus:text-pink-700 transition duration-200 ease-in-out"
                href={`/commitment`}
              >
                Go back
              </a>
              <p />
            </div>
          )}
        </div>
      </div>
    )
  }

}

export default EditCommitment
