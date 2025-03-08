import { useState } from "react";
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
const TaskList = ({ prevTasks, tasks }) => {
  const [tasksList, setTasksList] = useState(tasks ? tasks : prevTasks);
  const getTaskPosition = (id) => tasksList.findIndex((el) => el.id === id);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    setTasksList((tasks) => {
      const originalPosition = getTaskPosition(active.id);
      const newPosition = getTaskPosition(over.id);
      return arrayMove(tasks, originalPosition, newPosition);
    });
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return tasksList ? (
    <DndContext
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
