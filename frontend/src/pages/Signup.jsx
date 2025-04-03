import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { NavLink, useNavigate } from "react-router";
import { signup } from "../services/auth";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameErrors, setNameErrors] = useState(null);
  const [usernameErrors, setUsernameErrors] = useState(null);
  const [emailErrors, setEmailErrors] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState(null);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const handleSignup = async () => {
    try {
      const res = await signup(username, email, name, password);
      if (res.error) {
        setNameErrors(null);
        setUsernameErrors(null);
        setEmailErrors(null);
        setPasswordErrors(null);
        setMessage(res.error);
      } else if (res.errors) {
        setMessage(null);
        handleErrors(res.errors);
      } else if (!res.success && res.message) {
        setSuccess(res.success);
        setMessage(res.message);
      } else if (res.success && res.message) {
        setNameErrors(null);
        setUsernameErrors(null);
        setEmailErrors(null);
        setPasswordErrors(null);
        setSuccess(res.success);
        setMessage(res.message);
        setEmail("");
        setUsername("");
        setPassword("");
        setName("");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const handleErrors = (errors) => {
    let nameErrors = errors.filter((error) => /\bname\b/i.test(error));
    let usernameErrors = errors.filter((error) => /\busername\b/i.test(error));
    let emailErrorsArr = errors.filter((error) => /\bemail\b/i.test(error));
    let passwordErrorsArr = errors.filter((error) =>
      /\bpassword\b/i.test(error)
    );
    setNameErrors(nameErrors.length ? nameErrors : null);
    setUsernameErrors(usernameErrors.length ? usernameErrors : null);
    setEmailErrors(emailErrorsArr.length ? emailErrorsArr : null);
    setPasswordErrors(passwordErrorsArr.length ? passwordErrorsArr : null);
  };

  return (
    <AuthLayout>
      <form onSubmit={e => e.preventDefault()} className="flex flex-col w-4/5 sm:max-w-xs sm:w-full">
        <h1 className="font-semibold text-4xl self-start text-[#0A2D29] mb-4 self-start py-2">
          Sign up
        </h1>
        {message && (
          <p
            className={` ${
              success
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }  text-xs w-full p-2 mb-4`}
          >
            {message}
          </p>
        )}
        <Input
          label="Username"
          src="/src/assets/user.svg"
          type="text"
          placeholder=""
          classNames="bg-white text-black rounded-sm text-sm w-full p-2 outline-none"
          value={username}
          onChange={(e) => {
            if (message) setMessage("");
            setUsernameErrors(null);
            setUsername(e.target.value);
          }}
        />
        {usernameErrors && (
          <div className="text-xs bg-[#E3123F] text-red-700 py-2 px-2 mb-2 rounded-xs relative flex flex-col">
            <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs">
              {usernameErrors.length}
            </span>
            <div>
              {usernameErrors.map((error, index) => (
                <div key={index} className="flex items-start mb-2">
                  <img
                    src="/src/assets/x-circle.svg"
                    className="mr-1"
                    alt="error"
                  />
                  <p key={index} className="text-white">
                    {error}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <Input
          label="Name"
          src="/src/assets/user.svg"
          type="text"
          placeholder=""
          classNames="bg-white text-black rounded-sm text-sm w-full p-2 outline-none"
          value={name}
          onChange={(e) => {
            if (message) setMessage("");
            setNameErrors(null);
            setName(e.target.value);
          }}
        />
        {nameErrors && (
          <div className="text-xs bg-[#E3123F] text-red-700 py-2 px-2 mb-2 rounded-xs relative flex flex-col">
            <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs">
              {nameErrors.length}
            </span>
            <div>
              {nameErrors.map((error, index) => (
                <div key={index} className="flex items-start mb-2">
                  <img
                    src="/src/assets/x-circle.svg"
                    className="mr-1"
                    alt="error"
                  />
                  <p key={index} className="text-white">
                    {error}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <Input
          label="Email"
          src="/src/assets/mail.svg"
          type="text"
          placeholder=""
          classNames="bg-white text-black rounded-sm text-sm  w-full p-2 outline-none "
          value={email}
          onChange={(e) => {
            if (message) setMessage("");
            setEmailErrors(null);
            setEmail(e.target.value);
          }}
        />
        {emailErrors && (
          <div className="text-xs bg-[#E3123F] text-red-700 py-2 px-2 mb-2 rounded-xs relative flex flex-col">
            <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs ">
              {emailErrors.length}
            </span>
            <div>
              {emailErrors.map((error, index) => (
                <div key={index} className="flex items-start mb-2">
                  <img
                    src="/src/assets/x-circle.svg"
                    className="mr-1"
                    alt="error"
                  />
                  <p key={index} className="text-white">
                    {error}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Input
          label="Password"
          src="/src/assets/lock.svg"
          type={showPassword ? "text" : "password"}
          placeholder=""
          classNames="bg-white text-black rounded-sm text-sm w-full p-2 outline-none"
          value={password}
          setShowPassword={setShowPassword}
          showPassword={showPassword}
          onChange={(e) => {
            if (message) setMessage("");
            setPasswordErrors(null);
            setPassword(e.target.value);
          }}
        />

        {passwordErrors && (
          <div className="text-xs bg-[#E3123F] text-red-700 py-2 px-2 mb-2 rounded-xs relative flex flex-col">
            <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs ">
              {passwordErrors.length}
            </span>
            <div className="">
              {passwordErrors.map((error, index) => (
                <div key={index} className="flex items-start mb-2">
                  <img
                    src="/src/assets/x-circle.svg"
                    className="mr-1"
                    alt="error"
                  />
                  <p key={index} className="text-white">
                    {error}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <Button
          onClick={handleSignup}
          type="submit"
          text="Sign up"
          classNames="text-white bg-[#124242] w-full py-2 rounded-sm cursor-pointer font-medium text-base hover:bg-teal-900 mb-5"
        />
        <p className=" w-full text-sm text-center">
          Already have an account?{" "}
          <NavLink
            className="ml-1 hover:text-teal-900 hover:underline text-teal-700 font-medium"
            to="/login"
          >
            Log in
          </NavLink>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
