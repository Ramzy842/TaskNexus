import React from "react";

const SkeletonCard = () => {
  return (
    <div
      className={`bg-gray-300 w-full rounded-sm flex justify-between items-center py-2 px-4 mb-1 animate-pulse`}
    >
      <div>
        <p
          className={`sm:hidden select-none mb-0.5 font-medium px-2 py-1 rounded-sm text-xs bg-gray-400/40 h-5 w-12 sm:w-24 animate-pulse`}
        ></p>
        <p className={`text-sm truncate bg-gray-400/40 h-6 w-24 sm:w-48 rounded-sm animate-pulse`}></p>
      </div>
      <div className="flex items-center justify-center animate-pulse ">
        <p
          className={`hidden sm:block font-medium px-2 py-1 bg-gray-400/50 h-4 w-12 rounded-sm text-xs animate-pulse`}
        ></p>
        <div className="flex items-center justify-center ml-2 gap-x-2 animate-pulse">
            <div className="h-4 w-4 bg-gray-400/50 rounded-sm animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-400/50 rounded-sm animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-400/50 rounded-sm animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
