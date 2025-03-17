
import { useDispatch } from "react-redux";
import { hideDeletionConfirmation, removeUserData } from "../redux/actions/userActions";
import Button from "./Button";

const DeleteUserConfirmation = () => {
    const dispatch = useDispatch()
    return (
        <div className="absolute bg-black/60 backdrop-blur-sm top-0 right-0 left-0 bottom-0 overflow-hidden flex items-center justify-center z-10 ">
            <div className="rounded-sm bg-linear-to-bl from-[#E3EAE9] to-[#A3C4C4] p-4 max-w-xs md:max-w-lg">
                <p className="font-semibold text-teal-950">Delete your account?</p>
                <p className="text-xs  md:max-w-4/6 text-teal-900">This action is irreversible and cannot be undone. Are you sure you want to proceed?</p>
                <span className="border-b-2 border-[#A4C5C4] inline-block w-full my-4"></span>
                <div className="flex items-center gap-x-2 max-w-xs ml-auto">
                    <div onClick={() => dispatch(hideDeletionConfirmation())} className="flex justify-center items-center bg-gray-600 hover:bg-gray-700 rounded-sm py-2 px-4 cursor-pointer w-full md:w-sm">
                        <Button
                            type="button"
                            text="Cancel"
                            classNames="text-white font-semibold text-sm  select-none cursor-pointer"
                        />
                    </div>
                    <div onClick={() =>  dispatch(removeUserData())} className="flex justify-center items-center bg-teal-600 hover:bg-teal-700 rounded-sm py-2 px-4 cursor-pointer w-full md:w-sm">
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
