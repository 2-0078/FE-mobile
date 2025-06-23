"use client";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const next = searchValue;
    params.set("search", next);
    setSearchValue("");
    redirect(`/funding?${params.toString()}`);
  };

  return (
    <div className="px-4 mb-4">
      <form className="flex gap-2" onSubmit={handleSearch}>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            name="searchQuery"
            placeholder="상품을 검색하세요"
            className="pl-10 bg-slate-800/50 border-gray-700 rounded-lg text-white placeholder-gray-400"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Button className="bg-green-500 px-4" type="submit">
          검색
        </Button>
      </form>
    </div>
  );
}
