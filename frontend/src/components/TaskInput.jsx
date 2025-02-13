import StatusSelection from "./StatusSelection";

const TaskInput = ({ type, placeholder, classNames, iconSrc, inputName, ...rest }) => {
    return <div className="flex items-center gap-x-2 mb-4">
        <img src={iconSrc} height={24} width={24} alt={inputName} />
        {type === "select" ?
            <StatusSelection />
            : <input
                type={type}
                placeholder={placeholder}
                className={classNames}
                {...rest}
            />}
    </div>
}

export default TaskInput;