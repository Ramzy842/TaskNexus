import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { useSelector } from "react-redux";

const TaskList = () => {
  const tasks = useSelector(state => state.tasks.tasks)
  const [tasksList, setTasksList] = useState(tasks);
  const getTaskPosition = (id) => tasksList.findIndex((el) => el.id === id);
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    let orderedTasks = null;
    setTasksList((tasks) => {
      const originalPosition = getTaskPosition(active.id);
      const newPosition = getTaskPosition(over.id);
      orderedTasks = arrayMove(tasks, originalPosition, newPosition);
      return orderedTasks;
    });
  };
  useEffect(() => {
    if (tasks)
      setTasksList(tasks)
  }, [tasks]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return tasksList && tasksList.length ? (
    <DndContext
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <SortableContext strategy={verticalListSortingStrategy} items={tasksList}>
        {tasksList.map((task) => {
          return (
            <TaskCard
              task={task}
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
            />
          );
        })}
      </SortableContext>
    </DndContext>
  ) : (
    <h1 className="font-bold text-teal-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl select-none flex justify-center text-center h-full items-center">
      You Currently have no tasks
    </h1>
  );
};

export default TaskList;
