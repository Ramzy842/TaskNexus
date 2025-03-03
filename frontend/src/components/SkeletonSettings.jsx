import React from "react";
import Button from "./Button";

export const SkeletonAccInfoCard = () => {
  return (
    <div className="flex items-center mb-2 justify-between animate-pulse">
      <div>
        <p className="text-teal-900 font-semibold h-5 w-32 bg-gray-300 mb-1 rounded-sm animate-pulse"></p>
        <p className="text-teal-800 font-normal text-sm h-5 w-48 bg-gray-300 rounded-sm animate-pulse"></p>
      </div>
      <div className="flex justify-center items-center bg-gray-300 rounded-sm py-2 px-4 h-10 w-24 animate-pulse"></div>
    </div>
  );
};

export const SkeletonPasswordChange = () => {
  return (
    <div className="bg-gray-300 p-2 rounded-sm md:py-1 md:px-1 md:pl-4 md:flex items-center justify-between mb-4 animate-pulse">
      <h1 className="h-5 md:h-8 w-1/2 md:w-56 bg-gray-400/30 mb-1 md:mb-0 rounded-sm animate-pulse"></h1>
      <div className="flex justify-center items-center bg-gray-400/30 rounded-sm py-2 px-4 h-10 w-full md:w-48 animate-pulse"></div>
    </div>
  );
};

const SkeletonAccInfo = () => {
  const info = [{ id: 0 }, { id: 1 }, { id: 2 }];
  return (
    <div className="mb-4">
      {info.map((el) => {
        const { id } = el;
        return <SkeletonAccInfoCard key={id} />;
      })}
    </div>
  );
};

const SkeletonRemoveAccount = () => {
  return (
    <div className="flex md:flex-col justify-between items-start animate-pulse">
      <div className="flex flex-col md:mb-2 w-full animate-pulse">
        <h1 className="bg-gray-300 w-36 h-4 rounded-sm mb-1 animate-pulse"></h1>
        <p className="w-11/12 bg-gray-300 h-8 rounded-sm animate-pulse"></p>
      </div>
      <div className="bg-gray-300 rounded-sm py-2 px-8 md:px-4 w-48 h-12 animate-pulse">
      </div>
    </div>
  );
};

const SkeletonSettings = () => {
  return (
    <>
      <div className="w-full flex justify-center animate-pulse ">
        <div
          className={`relative w-24 rounded-3xl bg-gray-300 rounded-full overflow-hidden h-24 md:h-32 md:w-32 mb-4 animate-pulse`}
        ></div>
      </div>
      <SkeletonAccInfo />
      <SkeletonPasswordChange />
      <SkeletonRemoveAccount />
    </>
  );
};

export default SkeletonSettings;
