import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";

const TaskCard = ({ setTitle,id, title, status }) => {
	return <div className={`border-b bg-white  w-full rounded-sm flex justify-between items-center py-2 px-4 mb-1 shadow-[0_0_8px_-2px_rgba(0,200,100,0.25)] border-transparent`}>
		<div>
			<p className={`sm:hidden select-none mb-0.5 font-medium ${status === "Completed" ? 'bg-green-100 text-green-700' : status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"} px-2 py-1 rounded-sm text-xs`}>{status}</p>
			<p className={`text-sm truncate`}>{title}</p>
		</div>
		<div className="flex items-center justify-center ">
		<p className={`hidden sm:block font-medium ${status === "Completed" ? 'bg-green-100 text-green-700' : status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"} px-2 py-1 rounded-sm text-xs`}>{status}</p>
			<div className="flex items-center justify-center ml-2 gap-x-2">
				<NavLink to={`/tasks/${id}/edit`}><img src="./src/assets/edit.svg" alt="edit icon" className="cursor-pointer" /></NavLink> 
				{status !== 'Completed' && <img src="./src/assets/check-circle.svg" alt="mark as completed icon" className="cursor-pointer" onClick={() => console.log("mark as complete")} />}
				<svg onClick={() => console.log("Delete")} className={`${status === 'Completed' ? 'bg-teal-900 rounded-sm' : ''} cursor-pointer`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M15 5L5 15" stroke={`${status === 'Completed' ? '#fff' : '#000'}`} stroke-linecap="round" stroke-linejoin="round" />
					<path d="M5 5L15 15" stroke={`${status === 'Completed' ? '#fff' : '#000'}`} stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</div>
		</div>
	</div>
};

export default TaskCard;
