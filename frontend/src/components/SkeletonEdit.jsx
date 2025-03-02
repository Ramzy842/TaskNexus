
import Button from "./Button";

const SkeletonEdit = () => {
  const taskDetails = ["Title", "Description", "Due Date", "Status"];
  return (
    <>
      <div className="sm:w-1/2 sm:max-w-1/2 mb-12 sm:mb-0 flex flex-col gap-2 animate-pulse">
        {taskDetails.map((detail, index) => (
          <div key={index} className="flex items-center gap-x-2 animate-pulse">
            <div className="p-4 rounded-sm bg-gray-300 animate-pulse"></div>
            <div
              key={index}
              className=" w-full cursor-pointer bg-gray-300 rounded-sm p-4 animate-pulse"
            ></div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-center items-center bg-gray-300 rounded-sm p-3 cursor-pointer mb-2 w-full animate-pulse">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="invisible"
          >
            <path
              d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 21V13H7V21"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 3V8H15"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Button
            disabled={true}
            type="button"
            text="Save"
            classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer invisible animate-pulse"
          />
        </div>
        <div className="flex justify-center items-center bg-gray-300 rounded-sm p-3 cursor-pointer mb-2 w-full animate-pulse">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="invisible"
          >
            <path
              d="M15 5L5 15"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 5L15 15"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Button
            disabled={true}
            type="button"
            text="Delete"
            classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer invisible animate-pulse"
          />
        </div>
      </div>
    </>
  );
};

export default SkeletonEdit;
