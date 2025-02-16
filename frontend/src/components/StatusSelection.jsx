import { useEffect, useState } from "react";

const StatusSelection = ({handler}) => {
    const [statuses, setStatuses] = useState([{
        id: 0,
        status: 'To Do',
        styles: "bg-yellow-100 text-yellow-700 hover:bg-yellow-300 px-4"
    },
    {
        id: 1,
        status: 'In Progress',
        styles: "bg-blue-100 text-blue-700  hover:bg-blue-300 px-4"
    },
    {
        id: 2,
        status: 'Completed',
        styles: "bg-green-100 text-green-700 hover:bg-green-300 px-4"
    }])
    const [selected, setSelected] = useState(statuses[0])
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useEffect(() => {
        handler(selected.status);
    }, [selected])
    return <div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className={`cursor-pointer ${selected.styles} px-2 py-1 rounded-sm text-xs font-medium border`}>{selected.status}</button>
        {isMenuOpen && <div className="flex flex-col absolute">
            {statuses.filter(status => status.status !== selected.status).map(stat => {
                const {status, styles, id} = stat;
                return <button key={id} onClick={() => {setSelected(statuses[id]); setIsMenuOpen(false)}} type="button" className={`cursor-pointer ${styles} px-2 py-1 rounded-sm text-xs font-medium`}>{status}</button>
            })}
        </div>}
    </div>
}

export default StatusSelection;