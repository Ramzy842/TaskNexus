import { useRef, useState } from "react";
import TaskCard from "./TaskCard";
import { Reorder } from "framer-motion";
const TaskList = ({ prevTasks, tasks }) => {
const [tasksList, setTasksList] = useState(tasks ? tasks : prevTasks);
//   const container = useRef(null);
  return tasksList ? (
    <Reorder.Group
      axis="y"
    //   ref={container}
      values={tasksList}
      onReorder={setTasksList}
    >
      {tasksList.map((task) => {
        return (
          <TaskCard
            // container={container}
            task={task}
            key={task.id}
            id={task.id}
            title={task.title}
            status={task.status}
          />
        );
      })}
    </Reorder.Group>
  ) : (
    <h1 className="font-bold text-teal-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl select-none flex justify-center text-center h-full items-center">
      You Currently have no tasks
    </h1>
  );
};

export default TaskList;
