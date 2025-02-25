import { useEffect, useState } from "react";
import StatusSelection from "./StatusSelection";

const TaskInput = ({ type, placeholder, classNames, iconSrc, inputName, value, ...rest }) => {
    const [val, setVal] = useState(value)
    // useEffect(() => {
    //     handler(val)
    // }, [val])
    return <div className="flex items-center gap-x-2 mb-2">
        <img src={iconSrc} height={24} width={24} alt={inputName} />
        {type === "select" ?
            <StatusSelection /* handler={handler} */ />
            : <input
                value={val}
                onChange={e => setVal(e.target.value)}
                type={type}
                placeholder={placeholder}
                className={classNames}
                {...rest}
            />}
    </div>
}

export default TaskInput;