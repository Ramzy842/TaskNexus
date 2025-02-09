const TaskCard = () => {
    return <div className="bg-gray-200 rounded-sm flex justify-between py-2 px-4 mb-1">
        <p className="text-sm ">Study AWS</p>
        <div className="flex items-center justify-center gap-2">
            <img src="./src/assets/edit.svg" alt="edit icon" className="cursor-pointer" />
            <img src="./src/assets/check-circle.svg" alt="mark as completed icon" className="cursor-pointer" />
            <img src="./src/assets/x.svg" alt="delete icon" className="cursor-pointer" />
        </div>
    </div>;
};

export default TaskCard;
