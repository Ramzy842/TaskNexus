import TaskCard from "./TaskCard"

const TaskList = ({prevTasks, tasks}) => {
	return prevTasks ? <div>
	{(tasks ? tasks : prevTasks).map(task => {
		return <TaskCard key={task.id} id={task.id} title={task.title} status={task.status} />
	})}
	</div> : <h1 className="font-bold text-teal-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl select-none flex justify-center text-center h-full items-center">You Currently have no tasks</h1>
		
	
}

export default TaskList