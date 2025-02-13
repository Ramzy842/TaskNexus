import { useState } from "react";
import Button from "../components/Button";
import TaskCreate from "../components/TaskCreate";

const DashboardLayout = ({ children }) => {
	const [formIsOpen, setFormIsOpen] = useState(false)
	return (
		<div className="grid grid-rows-[auto_1fr] max-h-screen h-screen overflow-hidden bg-[#E3EAE9] p-4">
			<div className="max-w-6xl m-auto w-full">
				<div className=" w-full flex justify-between items-center mb-4">
					<div className={`flex items-center bg-linear-to-r ${formIsOpen ? 'from-teal-900 to-gray-500' : 'from-teal-900 to-teal-700'}  rounded-md p-3 cursor-pointer`} onClick={() => setFormIsOpen(true)}>
						<Button
							type="button"
							text="Add task"
							classNames={`${formIsOpen ? 'text-gray-300' : 'text-white'} font-semibold text-base mr-2 select-none cursor-pointer`}
							disabled={formIsOpen ? true : false}
						/>
						<svg width="24" height="24" className={`${formIsOpen ? 'stroke-gray-300' : 'stroke-white' }`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 5V19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M5 12H19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
					<div className="flex items-center">
						<h1 className="hidden sm:flex mr-4 font-semibold text-[#0A2D29]">ParadoxStyx</h1>
						<div className="w-12 bg-teal-800 rounded-3xl h-12"></div>
					</div>
				</div>
				<div className="w-full absolute bottom-4 right-4 left-1/2 -translate-x-1/2 flex justify-end max-w-6xl mx-auto px-4 xl:px-0">
					<div className="rounded-md hover:bg-teal-700 group hover:text-white p-2 flex items-center cursor-pointer">
						<svg className="mr-2 group-hover:stroke-white stroke-black" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 28H6.66667C5.95942 28 5.28115 27.719 4.78105 27.219C4.28095 26.7189 4 26.0406 4 25.3333V6.66667C4 5.95942 4.28095 5.28115 4.78105 4.78105C5.28115 4.28095 5.95942 4 6.66667 4H12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M21.334 22.6673L28.0007 16.0007L21.334 9.33398" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M28 16H12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<Button text="Log out" classNames="text-lg select-none cursor-pointer" />
					</div>
				</div>
				{formIsOpen && <TaskCreate setFormIsOpen={setFormIsOpen} /> } 
			</div>
			<div className="max-w-6xl mx-auto w-full">{children}</div>
		</div>
	);
};

export default DashboardLayout;
