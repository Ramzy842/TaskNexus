import TaskCard from "./TaskCard"
import { useState, useEffect } from 'react'

const TaskList = ({tasks}) => {
	return (
		<div className="overflow-y-auto max-h-1/2 mb-4">
		{tasks.map(task => {
			return <TaskCard key={task.id} title={task.title} status={task.status} />
		})}
		</div>
	)
}

export default TaskList