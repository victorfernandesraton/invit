import { NullstackClientContext } from 'nullstack'

type CentralFormContainerProps = {
  title?: string
}

export function CentralFormContainer({ title, children }: NullstackClientContext<CentralFormContainerProps>) {
  return (
    <div class="mt-12 align-middle flex justify-center h-full px-6 sm:px-0">
      <div class="h-1/3 content-center flex flex-col w-full sm:w-2/5 p-6 rounded-lg bg-amber-100 max-w-md border border-black border-b-4 border-r-4">
        {title && <h1 class="text-xl md:text-2xl py-2">{title}</h1>}
        {children}
      </div>
    </div>
  )
}
