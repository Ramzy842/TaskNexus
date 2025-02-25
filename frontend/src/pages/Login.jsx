import { useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";
import { NavLink, useNavigate } from "react-router";

import loginUser from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrors, setEmailErrors] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.auth.error);
  let message = useSelector((state) => state.auth.message);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (user) navigate("/");
  }, [user]);
  useEffect(() => {
    if (errors) handleErrors(errors);
    else {
      setEmailErrors(null);
      setPasswordErrors(null);
    }
  }, [errors]);
  const handleLogin = async () => {
    dispatch(loginUser(email, password));
  };
  const handleErrors = (errors) => {
    let emailErrorsArr = errors.filter((error) => /\bemail\b/i.test(error));
    let passwordErrorsArr = errors.filter((error) =>
      /\bpassword\b/i.test(error)
    );
    setEmailErrors(emailErrorsArr.length ? emailErrorsArr : null);
    setPasswordErrors(passwordErrorsArr.length ? passwordErrorsArr : null);
  };

  return (
    <AuthLayout>
      <form action="#" className="flex flex-col w-4/5 sm:max-w-xs sm:w-full">
        <h1 className="font-semibold text-4xl self-start text-[#0A2D29] mb-4 self-start py-2">
          Log in
        </h1>
        {message && (
          <p className="text-xs bg-red-200 text-red-700 p-2 mb-2 rounded-xs">
            {message}
          </p>
        )}
        <Input
          label="Email"
          type="text"
          placeholder=""
          classNames="bg-white text-black p-2 block rounded-sm mb-4 w-full text-sm outline-none border-b border-transparent focus:border-teal-400"
          value={email}
          onChange={(e) => {
            setEmailErrors(null);
            setEmail(e.target.value);
          }}
        />
        {emailErrors && (
          <div className="text-xs bg-red-200 text-red-700 py-1 px-2 mb-2 rounded-xs relative flex flex-col">
            <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs ">
              {emailErrors.length}
            </span>
            <div>
              {emailErrors.map((error, index) => (
                <p key={index} className="">
                  - {error}
                </p>
              ))}
            </div>
          </div>
        )}
        <div className="mb-3 relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder=""
            classNames="bg-white text-black  pr-12 p-2 block rounded-sm  w-full text-sm flex-1 outline-none border-b border-transparent focus:border-teal-400"
            value={password}
            onChange={(e) => {
              setPasswordErrors(null);
              setPassword(e.target.value);
            }}
          />
          <img
            onClick={() => setShowPassword(!showPassword)}
            src={
              showPassword ? "./src/assets/show.svg" : "./src/assets/hide.svg"
            }
            className="absolute bottom-1.5 h-6 right-1.5 cursor-pointer z-2 bg-white "
            alt="hide/show password"
          />
        </div>
        {passwordErrors && (
          <div className="text-xs bg-red-200 text-red-700 py-1 px-2 mb-2 rounded-xs relative flex flex-col">
            <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs ">
              {passwordErrors.length}
            </span>
            <div>
              {passwordErrors.map((error, index) => (
                <p key={index} className="">
                  - {error}
                </p>
              ))}
            </div>
          </div>
        )}
        <p className="w-full text-end text-xs mb-4 font-normal cursor-pointer">
          Forgot your password?
        </p>
        <Button
          onClick={handleLogin}
          type="button"
          text="Log in"
          classNames="text-white bg-[#124242] w-full py-2 rounded-sm cursor-pointer font-medium text-base hover:bg-teal-900"
        />
        <div className="flex flex-col items-center">
          <p className="font-normal bg-[#E3EAE9] z-2 text-[#124242] text-sm my-4 text-center px-2">
            Or continue with
          </p>
          <div className="h-[1.5px] bg-teal-800 w-full relative bottom-6.5"></div>
        </div>

        <div className="border border-[#124242] w-full py-2 px-4 hover:bg-white group rounded-sm flex justify-center items-center cursor-pointer mb-5">
          <img src="./src/assets/google.svg" alt="google login" />
          <Button
            type="button"
            text="Log in with Google"
            classNames=" bg-transparent text-[#124242] group-hover:cursor-pointer w-full h-full bg-red-400 text-center font-medium text-sm "
          />
        </div>
        <p className=" w-full text-sm text-center">
          Don't have an account?{" "}
          <NavLink className="text-teal-700 font-medium" to="/signup">
            Signup
          </NavLink>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
