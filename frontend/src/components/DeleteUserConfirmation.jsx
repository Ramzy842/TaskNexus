
import { useDispatch } from "react-redux";
import { removeUserData } from "../redux/actions/userActions";
import Button from "./Button";

const DeleteUserConfirmation = ({setShowConfirmation}) => {
    const dispatch = useDispatch()
    return (
        <div className="absolute bg-black/50 backdrop-blur-sm top-0 right-0 left-0 bottom-0 overflow-hidden flex items-center justify-center z-10 ">
            <div className="rounded-sm bg-gray-200 p-4 max-w-xs md:max-w-lg">
                <p className="font-semibold text-teal-950">Delete your account?</p>
                <p className="text-xs mb-4 md:max-w-4/6 text-teal-950">This action is irreversible and cannot be undone. Are you sure you want to proceed?</p>
                <div className="flex items-center gap-x-2 max-w-xs ml-auto">
                    <div onClick={() => setShowConfirmation(false)} className="flex justify-center items-center bg-gray-600 hover:bg-gray-700 rounded-sm py-2 px-4 cursor-pointer w-full md:w-sm">
                        <Button
                            type="button"
                            text="Cancel"
                            classNames="text-white font-semibold text-sm  select-none cursor-pointer"
                        />
                    </div>
                    <div onClick={() =>  dispatch(removeUserData())} className="flex justify-center items-center bg-green-600 hover:bg-green-700 rounded-sm py-2 px-4 cursor-pointer w-full md:w-sm">
                        <Button
                            type="button"
                            text="Confirm"
                            classNames="text-white font-semibold text-sm  select-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserConfirmation;
