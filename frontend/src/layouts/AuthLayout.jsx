import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { resetAuth } from "../redux/actions/authActions";
import { useEffect, useRef, useState } from "react";

const AuthLayout = ({ children }) => {
	const dispatch = useDispatch()
	const loading = useSelector(state => state.auth.loading);
	const headerRef = useRef();
	const [dimensions, setDimensions] = useState(null)
	useEffect(() => {
		if (headerRef.current) {
			const rect = headerRef.current.getBoundingClientRect();
			setDimensions(rect);
			console.log("Header Ref:", headerRef.current);
			console.log("Header Dimensions:", rect);
		}
	}, []);
	return (
		<div className={`grid grid-rows-[auto_1fr] h-screen`}>
			<div ref={headerRef} className="bg-[#144B4B] w-full flex justify-center items-center">
				<NavLink onClick={() => dispatch(resetAuth())} to="/" className="font-radCan text-[#E3EAE9] text-3xl font-bold uppercase">
					TaskNexus
				</NavLink>
			</div>
			{loading && dimensions &&  <div style={{top: `${dimensions.height}px`}} className={`absolute   h-2 w-full bg-gradient-to-r from-teal-500 from-10% via-teal-500 via-50% to-emerald-500 to-90% animate-pulse`}></div>}
			<div className="bg-[#E3EAE9] flex justify-center flex-col items-center w-full">{children}</div>
		</div>
	);
};

export default AuthLayout;
