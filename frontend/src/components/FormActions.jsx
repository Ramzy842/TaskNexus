import Button from "./Button";
import { useDispatch} from "react-redux";
import {
  addTask,
  resetTaskCreation,
} from "../redux/actions/taskActions";
import { useNavigate } from "react-router";

const FormActions = ({ taskData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSave = () => {
    dispatch(
      addTask(
        taskData.title,
        taskData.description,
        taskData.dueDate,
        taskData.status
      )
    );
  };
  return (
    <div className="flex justify-center sm:flex-col sm:items-center gap-x-2">
      <div
        onClick={handleSave}
        className=" flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 rounded-sm p-3 cursor-pointer sm:mb-2 w-full"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
          type="button"
          text="Save"
          classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer "
        />
      </div>
      <div
        className="flex justify-center items-center bg-[#E3123F] hover:bg-red-700 rounded-sm p-3 cursor-pointer sm:mb-2 w-full"
        onClick={() => {
          dispatch(resetTaskCreation());
          navigate("/");
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 6L18 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Button
          type="button"
          text="Cancel"
          classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default FormActions;
