import { Database } from '../../../lib/database.types'
import { numToCurrency } from '../../../lib/utils/currency'
import { parseDateToString } from '../../../lib/utils/date'
import { countTotalAmmount } from './utils'

type Props = Database['public']['Tables']['commitment']['Row'] & {
  ticket: {
    id: string
    billing: {
      price: number
    }
  }[]
}

export function CommitmentItem({ id, title, description, start_at, end_at, currency, ticket }: Props) {
  return (
    <div class="flex flex-col md:flex-row  rounded-lg bg-white border border-black border-b-4 border-r-4">
      <div class="flex flex-col md:flex-row w-full">
        <div class="p-6 flex flex-col flex-1">
          <div class="flex flex-col gap-2 mb-2">
            <div
              class="flex flex-row gap-2 
						
						text-pink-600 text-xs underline underline-offset-1
						"
            >
              <a href={`/adm/commitment/${id}`} class="">
                Edit
              </a>
              <a href={`/adm/commitment/${id}/billing`} class="">
                Prices
              </a>
              <a href={`/commitment/${id}`} class="">
                Preview
              </a>
            </div>
            <h5 class="text-black text-lg font-medium text-ellipsis	">{title}</h5>
          </div>

          <p class="text-gray-700 text-base mb-4">{description}</p>
          <div class="flex flex-row space-x-6">
            <p class="text-gray-700 text-xs">
              Start At: <spam class="text-pink-700">{parseDateToString(new Date(start_at))}</spam>
            </p>
            {end_at && (
              <p class="text-gray-700 text-xs">
                End At: <spam class="text-pink-700">{parseDateToString(new Date(end_at))}</spam>
              </p>
            )}
          </div>
        </div>
        <div class="p-6 py-2 md:py-6 mb-6 md:mb-0 flex flex-col">
          <div class="flex flex-col space-y-2">
            <p class="md:text-sm">Ammount total</p>
            <h5 class="text-pink-700 lg:text-xl md:text-md text-xs">
              {numToCurrency(countTotalAmmount(ticket) / 100)} {currency}
            </h5>
          </div>
        </div>
      </div>
    </div>
  )
}
