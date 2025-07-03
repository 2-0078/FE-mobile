"use client";

import { Button } from "@/components/ui/button";
import { Delete, RotateCcw } from "lucide-react";

interface NumberPadProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export function NumberPad({
  onNumberClick,
  onDelete,
  onClear,
}: NumberPadProps) {
  return (
    <div className="px-6 ">
      <div className="grid grid-cols-4 gap-4">
        {/* 첫 번째 줄: 1, 2, 3, Clear */}
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-black  text-white text-xl font-bold"
          onClick={() => onNumberClick("1")}
        >
          1
        </Button>
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-black  text-white text-xl font-bold"
          onClick={() => onNumberClick("2")}
        >
          2
        </Button>
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-black  text-white text-xl font-bold"
          onClick={() => onNumberClick("3")}
        >
          3
        </Button>
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-red-600 text-white text-sm font-bold"
          onClick={onClear}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        {/* 두 번째 줄: 4, 5, 6, 7 */}
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-black  text-white text-xl font-bold"
          onClick={() => onNumberClick("4")}
        >
          4
        </Button>
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-black  text-white text-xl font-bold"
          onClick={() => onNumberClick("5")}
        >
          5
        </Button>
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-black  text-white text-xl font-bold"
          onClick={() => onNumberClick("6")}
        >
          6
        </Button>
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-black  text-white text-xl font-bold"
          onClick={() => onNumberClick("7")}
        >
          7
        </Button>

        {/* 세 번째 줄: 8, 9, 0, Delete */}
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-black  text-white text-xl font-bold"
          onClick={() => onNumberClick("8")}
        >
          8
        </Button>
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-black  text-white text-xl font-bold"
          onClick={() => onNumberClick("9")}
        >
          9
        </Button>
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-black  text-white text-xl font-bold"
          onClick={() => onNumberClick("0")}
        >
          0
        </Button>
        <Button
          variant="ghost"
          className="w-14 h-14 rounded-full bg-gray-600  text-white text-xl font-bold"
          onClick={onDelete}
        >
          <Delete className="size-5" />
        </Button>
      </div>
    </div>
  );
}
