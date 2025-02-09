import Button from "../components/Button";

const DashboardLayout = ({ children }) => {
	return (
		<div className="grid grid-rows-[auto_1fr] h-screen bg-[#C2D0CE] p-4 overflow-hidden">
			<div className=" w-full flex justify-between items-center mb-4">
				<Button
					type="button"
					text="Add task"
					classNames="text-white bg-[#124242] px-4 py-2 rounded-sm cursor-pointer font-bold text-base hover:bg-teal-900"
				/>
				<div className="flex items-center">
					<h1 className="hidden sm:flex mr-4 font-semibold text-[#0A2D29]">ParadoxStyx</h1>
					<div className="w-12 bg-teal-800 rounded-3xl h-12"></div>
				</div>
			</div>
			<div className="h-full">{children}</div>
			<div className="absolute bottom-4 p-2 right-4 flex cursor-pointer">
				<img src="./src/assets/log-out.svg" className="mr-2" alt="" />
				<Button text="Log out" classNames="text-xl" />
			</div>
			
		</div>
	);
};

export default DashboardLayout;
