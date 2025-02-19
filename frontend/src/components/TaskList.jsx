import TaskCard from "./TaskCard"

const TaskList = ({tasks}) => {
	return (
		<div className="mb-4 max-h-1/2 h-3/4 md:h-1/2">
		{tasks.map(task => {
			return <TaskCard key={task.id} id={task.id} title={task.title} status={task.status} />
		})}
		</div>
	)
}

export default TaskList