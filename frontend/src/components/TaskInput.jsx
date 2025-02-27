import { useSelector } from "react-redux";
import StatusSelection from "./StatusSelection";
import { useEffect, useState } from "react";

const TaskInput = ({
  target,
  type,
  placeholder,
  classNames,
  statusHandler,
  iconSrc,
  inputName,
  handler,
  value,
  editMode,
  ...rest
}) => {
  const [inputErrors, setInputErrors] = useState(null);
  let errors = useSelector((state) => state.tasks.creationErrors);
  let loading = useSelector(state => state.tasks.isCreating)
  useEffect(() => {
    if (errors)
    {
      const filteredErrors = errors.filter((error) =>
        new RegExp(`\\b${target}\\b`, "i").test(error)
      );
      if (filteredErrors && filteredErrors.length)
        setInputErrors(filteredErrors)
      else
        setInputErrors(null)
    }
    else
      setInputErrors(null)
  }, [errors, loading, target]);

  return (
    <div className="flex items-center gap-x-2 mb-2">
      <img src={iconSrc} height={24} width={24} alt={inputName} />
      <div className="w-full">
        {type === "select" ? (
          <StatusSelection value={value} handler={statusHandler} />
        ) : (
          <input
            value={value}
            onChange={handler}
            type={type}
            placeholder={placeholder}
            className={classNames}
            {...rest}
          />
        )}
        {!editMode && inputErrors && target !== "status" && (
          <div className="text-xs bg-red-200 text-red-700 pb-2 pl-2 mb-2 rounded-xs relative flex flex-col bg-red-300">
            <span className="self-end bg-red-500 text-white rounded-sm mt-1 mr-1 px-1 font-bold text-xs ">
              {inputErrors.length}
            </span>
            <div>
              {inputErrors.map((error, index) => (
                <p key={index}>- {error}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskInput;
