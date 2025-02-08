import SearchBox from './filters/SearchBox'
import SizeResults from './filters/SizeResults'

export default function Filters () {
  return (
    <div className="filters flex flex-row justify-between mb-8">
      <SizeResults />
      <SearchBox />
    </div>
  )
}
