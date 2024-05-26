import { IconSearch } from './Icons'

export default function InputSearch () {
  return (
    <label className="w-full flex items-center gap-2 bg-black p-2 rounded-xl">
      <IconSearch />
      <input type="search" placeholder="Algo que buscar..."
        className="w-full h-full px-2 border-none outline-none"
      />
    </label>
  )
}
