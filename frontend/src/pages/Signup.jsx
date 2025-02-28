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
    const [showPassword, setShowPassword] = useState(false)
    const [nameErrors, setNameErrors] = useState(null);
    const [usernameErrors, setUsernameErrors] = useState(null);
    const [emailErrors, setEmailErrors] = useState(null);
    const [passwordErrors, setPasswordErrors] = useState(null);
    const [message, setMessage] = useState(null)
    const [success, setSuccess] = useState(null)
    const navigate = useNavigate()
    const handleSignup = async () => {
        try {
            const res = await signup(username, email, name, password);
            if (res.errors) {
                setMessage(null);
                handleErrors(res.errors)
            }
            else if (res.message) {

                setEmailErrors(null);
                setPasswordErrors(null)
                setSuccess(res.success);
                setMessage(res.message);
                setEmail("");
                setUsername("")
                setPassword("")
                setName("")
                setTimeout(() => {
                    navigate("/login");
                }, 3000)
            }
        }
        catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
        }
    }

    const handleErrors = (errors) => {
        let nameErrors = errors.filter(error => /\bname\b/i.test(error))
        let usernameErrors = errors.filter(error => /\busername\b/i.test(error))
        let emailErrorsArr = errors.filter(error => /\bemail\b/i.test(error))
        let passwordErrorsArr = errors.filter(error => /\bpassword\b/i.test(error))
        setNameErrors(nameErrors.length ? nameErrors : null)
        setUsernameErrors(usernameErrors.length ? usernameErrors : null)
        setEmailErrors(emailErrorsArr.length ? emailErrorsArr : null);
        setPasswordErrors(passwordErrorsArr.length ? passwordErrorsArr : null)
    }

    return (
        <AuthLayout>
            <form action="#" className="flex flex-col w-4/5 sm:max-w-xs sm:w-full">
                <h1 className="font-semibold text-4xl self-start text-[#0A2D29] mb-4 self-start py-2">
                    Sign up
                </h1>
                {message && <p className={` ${success ? "bg-green-200 text-green-800": "bg-red-200 text-red-800"}  text-xs md:text-sm w-full p-2 mb-4`}>{message}</p>} 
                <Input
                    label="Username"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black p-2 rounded-sm  mb-4  text-sm   border-b border-transparent focus:border-teal-400"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {usernameErrors && <div className="text-xs bg-red-200 text-red-700 py-1 px-2 mb-2 rounded-xs relative flex flex-col">
                    <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs">{usernameErrors.length}</span>
                    <div>
                        {usernameErrors.map((error, index) =>
                            <p key={index} className="">- {error}</p>
                        )}
                    </div>
                </div>}
                <Input
                    label="Name"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black p-2 rounded-sm mb-4 text-sm border-b border-transparent focus:border-teal-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {nameErrors && <div className="text-xs bg-red-200 text-red-700 py-1 px-2 mb-2 rounded-xs relative flex flex-col">
                    <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs">{nameErrors.length}</span>
                    <div>
                        {nameErrors.map((error, index) =>
                            <p key={index} className="">- {error}</p>
                        )}
                    </div>
                </div>}
                <Input
                    label="Email"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black p-2 rounded-sm  mb-4  text-sm   border-b border-transparent focus:border-teal-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {emailErrors && <div className="text-xs bg-red-200 text-red-700 py-1 px-2 mb-2 rounded-xs relative flex flex-col">
                    <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs ">{emailErrors.length}</span>
                    <div>
                        {emailErrors.map((error, index) =>
                            <p key={index} className="">- {error}</p>
                        )}
                    </div>
                </div>}
                <div className="relative mb-4 ">
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder=""
                        classNames="bg-white text-black p-2 rounded-sm text-sm pr-12 border-b border-transparent focus:border-teal-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img onClick={() => setShowPassword(!showPassword)} src={showPassword ? "./src/assets/show.svg" : "./src/assets/hide.svg"} className="absolute bottom-1.5 h-6 right-1.5 cursor-pointer z-2 bg-white " alt="hide/show password" />

                </div>
                {passwordErrors && <div className="text-xs bg-red-200 text-red-700 py-1 px-2 mb-2 rounded-xs relative flex flex-col">
                    <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs ">{passwordErrors.length}</span>
                    <div className="">
                        {passwordErrors.map((error, index) =>
                            <p key={index} className="">- {error}</p>
                        )}
                    </div>
                </div>}
                <Button
                    onClick={handleSignup}
                    type="button"
                    text="Sign up"
                    classNames="text-white bg-[#124242] w-full py-2 rounded-sm cursor-pointer font-medium text-base hover:bg-teal-900 mb-5"
                />
                <p className=" w-full text-sm text-center">Already have an account? <NavLink className='ml-1 hover:text-teal-900 hover:underline text-teal-700 font-medium' to="/login">Log in</NavLink></p>
            </form>
        </AuthLayout>
    );
};

export default Signup;
