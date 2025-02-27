import TaskCard from "./TaskCard"

const TaskList = ({tasks}) => {
	return (
		<div className="">
		{tasks.map(task => {
			return <TaskCard key={task.id} id={task.id} title={task.title} status={task.status} />
		})}
		</div>
	)
}

export default TaskList