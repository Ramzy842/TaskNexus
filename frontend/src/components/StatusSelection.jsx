import { useState } from "react";

const StatusSelection = ({value, handler  }) => {
    const [val, setVal] = useState(value)
    const statuses = [
        {
            id: 0,
            status: "To Do",
            styles: "bg-yellow-600 text-yellow-100 hover:bg-yellow-700 px-4",
        },
        {
            id: 1,
            status: "In Progress",
            styles: "bg-blue-600 text-blue-100  hover:bg-blue-700 px-4",
        },
        {
            id: 2,
            status: "Completed",
            styles: "bg-teal-600 text-teal-100 hover:bg-teal-700 px-4",
        },
    ];
    const status = statuses.find(stat => stat.status === val)
    const [selected, setSelected] = useState(status);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"   
                className={`cursor-pointer ${selected.styles} px-2 py-1.5  ${!isMenuOpen ? "rounded-sm" : "rounded-t-xs"} text-xs font-medium w-28`}
            >
                {selected.status}
            </button>
            {isMenuOpen && (
                <div className="flex flex-col absolute rounded-sm">
                    {statuses
                        .filter((status) => status.status !== selected.status)
                        .map((stat) => {
                            const { status, styles, id } = stat;
                            return (
                                <button
                                    key={id}
                                    onClick={() => {
                                        setSelected(statuses[id]);
                                        handler(statuses[id].status)
                                        setIsMenuOpen(false);
                                    }}
                                    type="button"
                                    className={`cursor-pointer ${styles} px-2 py-1.5 text-xs font-medium w-28`}
                                >
                                    {status}
                                </button>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

export default StatusSelection;
