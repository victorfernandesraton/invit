import { NullstackClientContext } from 'nullstack'

type Props = {
  title: string
}
export default function ShowContainer({ children, title }: NullstackClientContext<Props>) {
  return (
    <div class="mt-8 flex align-middle justify-center">
      <div class="flex flex-col w-5/6 lg:w-2/3">
        <div class="flex flex-row align-middle justify-between mb-4 w-full">
          <h3 class="text-black text-xl font-medium">{title}</h3>
          <a href="/commitment/create">
            <button
              class=" w-20
                  bg-pink-600
                text-white
                font-medium
                text-xs
                h-8
                leading-tight
                uppercase
                rounded
                border border-b-4 border-r-4 border-black
                hover:bg-white hover:text-pink-700 hover:border-pink-700
                transition
                duration-150
                ease-in-out"
            >
              Create
            </button>
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
