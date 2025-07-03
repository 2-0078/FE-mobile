import SearchIcon from '@/repo/ui/Icons/SearchIcon';

const Search = () => (
  <div className="flex items-center bg-custom-slate rounded-3xl py-1 w-full">
    <div className="w-9 h-9 rounded-full bg-custom-green flex items-center justify-center mr-2">
      <SearchIcon />
    </div>
    <input
      className="bg-transparent flex-1 text-white placeholder-custom-gray-200 text-sm outline-none"
      placeholder="상품을 검색하세요."
      type="text"
    />
  </div>
);

export default Search;
