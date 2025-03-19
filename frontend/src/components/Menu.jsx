import { Link, useNavigate } from "react-router";
import { resetAuth } from "../redux/actions/authActions";
import { resetTasks } from "../redux/actions/taskActions";
import { resetUser } from "../redux/actions/userActions";
import { logout } from "../services/auth";
import { useDispatch } from "react-redux";

const Menu = ({setShowMenu}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear()
      dispatch(resetAuth());
      dispatch(resetTasks());
      dispatch(resetUser());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ul className="absolute w-[120px] max-w-[160px]  top-full mt-2 right-0 rounded-sm overflow-hidden bg-teal-900 z-30">
      <Link onClick={() => setShowMenu(false)} to="/settings" className="">
        <li  className="flex items-center p-2 justify-center text-white text-xs md:text-sm group rounded-b-md hover:bg-teal-700 cursor-pointer uppercase font-medium border-b border-transparent hover:border-teal-600">
          <img src="/src/assets/settings.svg" className="mr-2" alt="settings" />
          <p>Settings</p>
        </li>
      </Link>
      <li
        onClick={handleLogout}
        className="flex items-center p-2 justify-center text-white text-xs md:text-sm rounded-t-md hover:bg-teal-700 cursor-pointer uppercase font-medium border-t border-transparent hover:border-teal-600"
      >
        <img src="/src/assets/log-out.svg" className="mr-2" alt="logout" />
        <p>Logout</p>
      </li>
    </ul>
  );
};

export default Menu;
