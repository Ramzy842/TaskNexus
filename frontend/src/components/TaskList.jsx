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
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosInstance";
import { getTasks } from "../redux/actions/taskActions";

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const [tasksList, setTasksList] = useState(tasks);
  const getTaskPosition = (id) => tasksList.findIndex((el) => el.id === id);
  // const dispatch = useDispatch()
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasksList((prevTasks) => {
      const originalPosition = getTaskPosition(active.id);
      const newPosition = getTaskPosition(over.id);
      let updatedTasks = arrayMove(prevTasks, originalPosition, newPosition);
      // console.log("before: ", updatedTasks);
      updatedTasks = updatedTasks.map((task, index) => ({
        ...task,
        order: updatedTasks.length - 1 - index,
      }));
      // console.log("After:", updatedTasks);
      updateTaskOrder(updatedTasks);
      return updatedTasks; // Update state with the new order values
    });
  };

  const updateTaskOrder = async (reorderedTasks) => {
    console.log("UPDATE:", reorderedTasks);
    try {
      const res = await api.put(
        `/users/${localStorage.getItem("id")}/tasks/reorder`,
        {
          reorderedTasks,
        }
      );
      console.log(res);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  useEffect(() => {
    if (tasks) {
      setTasksList(tasks);
    }
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
