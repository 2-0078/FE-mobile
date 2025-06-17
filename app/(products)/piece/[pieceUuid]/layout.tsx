import React from "react";
export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}

      <div className="px-4 mt-2 fixed bottom-8 left-0 right-0">
        <button className="w-full bg-custom-green text-black font-semibold py-3 rounded-full text-lg shadow">
          Checkout
        </button>
      </div>
    </>
  );
}
