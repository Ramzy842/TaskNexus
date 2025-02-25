import { useDispatch } from "react-redux";
import { NavLink } from "react-router";
import { resetAuth } from "../redux/actions/authActions";

const AuthLayout = ({ children }) => {
	const dispatch = useDispatch()
	return (
		<div className="grid grid-rows-[auto_1fr] h-screen">
			<div  className="bg-[#144B4B] w-full flex justify-center items-center">
				<NavLink onClick={() => dispatch(resetAuth())} to="/" className="font-radCan text-[#E3EAE9] text-3xl font-bold uppercase">
					TaskNexus
				</NavLink>
			</div>
			<div className="bg-[#E3EAE9] flex justify-center flex-col items-center w-full">{children}</div>
		</div>
	);
};

export default AuthLayout;
