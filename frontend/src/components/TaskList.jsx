import TaskCard from "./TaskCard"
// mb-4 max-h-9/11 overflow-y-auto h-3/4 md:h-9/11
const TaskList = ({tasks}) => {
	return (
		<div className="mb-4 max-h-9/11 overflow-y-auto h-3/4 md:h-9/11">
		{tasks.map(task => {
			return <TaskCard key={task.id} title={task.title} status={task.status} />
		})}
		</div>
	)
}

export default TaskList