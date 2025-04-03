import { useSelector } from "react-redux";
import StatusSelection from "./StatusSelection";
import { useEffect, useState } from "react";
import decodeHtmlEntities from "../utils/decodeHtmlEntities";

const TaskInput = ({
  target,
  type,
  placeholder,
  classNames,
  statusHandler,
  iconSrc,
  inputName,
  value,
  editMode,
  handler,
  handleStatusChange,
  ...rest
}) => {
  const [inputErrors, setInputErrors] = useState(null);
  let creationErrors = useSelector((state) => state.tasks.creationErrors);
  let editingErrors = useSelector(state => state.tasks.error)
  let loading = useSelector(state => state.tasks.isCreating)
  useEffect(() => {
    if (creationErrors || editingErrors)
    {
      const filteredErrors = (creationErrors ? creationErrors : editingErrors).filter((error) =>
        new RegExp(`\\b${target}\\b`, "i").test(error)
      );
      if (filteredErrors && filteredErrors.length)
        setInputErrors(filteredErrors)
      else
        setInputErrors(null)
    }
    else
      setInputErrors(null)
    console.log("Creating errors:", creationErrors);
    console.log("Editing errors:", editingErrors);
  }, [creationErrors, editingErrors, loading, target]);

  return (
    <div className="flex items-center gap-x-2 mb-2">
      <img src={iconSrc} height={24} width={24} alt={inputName} />
      <div className="w-full">
        {type === "select" ? (
          <StatusSelection value={value} handler={editMode ? statusHandler : handleStatusChange} />
        ) : (
          <input
            value={decodeHtmlEntities(value)}
            type={type}
            onChange={!editMode && handler}
            placeholder={placeholder}
            className={classNames}
            {...rest}
          />
        )}
        {inputErrors && target !== "status" && (
          <div className="text-xs bg-[#E3123F] text-red-700 py-2 px-2 mb-2 rounded-xs relative flex flex-col">
            <span className="self-end bg-red-500 text-white rounded-sm mt-1 mr-1 px-1 font-bold text-xs ">
              {inputErrors.length}
            </span>
            <div>
              {inputErrors.map((error, index) => (
                <div key={index} className="flex items-start mb-2">
                <img src="/src/assets/x-circle.svg" className="mr-1" alt="error" /> 
                <p key={index} className="text-white">
                  {error}
                </p>
              </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskInput;
