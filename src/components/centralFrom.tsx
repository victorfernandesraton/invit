import { NullstackNode } from 'nullstack'

type CentralFormContainerProps = {
  title?: string
  children?: NullstackNode
}

export function CentralFormContainer({ title, children }: CentralFormContainerProps) {
  return (
    <div class="flex justify-center px-6 sm:px-0 w-screen">
      <div class="content-center flex flex-col w-full p-6 rounded-lg bg-amber-100 border border-black border-b-4 border-r-4">
        {title && <h1 class="text-xl md:text-2xl py-2">{title}</h1>}
        {children}
      </div>
    </div>
  )
}
