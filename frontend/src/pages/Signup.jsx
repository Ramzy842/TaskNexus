import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { NavLink } from "react-router";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    return (
        <AuthLayout>
            <form action="#" className="flex flex-col w-4/5 sm:max-w-xs sm:w-full">
                <h1 className="font-semibold text-4xl self-start text-[#0A2D29] mb-4 self-start py-2">
                    Sign up
                </h1>
                <Input
                    label="Username"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black p-2 rounded-sm  mb-4  text-sm   border-b border-transparent focus:border-teal-400"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    label="Name"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black p-2 rounded-sm  mb-4  text-sm  border-b border-transparent focus:border-teal-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Email"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black p-2 rounded-sm  mb-4  text-sm   border-b border-transparent focus:border-teal-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="relative mb-4">
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder=""
                        classNames="bg-white text-black p-2 rounded-sm text-sm pr-12 border-b border-transparent focus:border-teal-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                   <img onClick={() => setShowPassword(!showPassword)} src={ showPassword ? "./src/assets/show.svg" : "./src/assets/hide.svg"} className="absolute bottom-1.5 h-6 right-1.5 cursor-pointer z-2 bg-white " alt="hide/show password" />
                </div>

                <Button
                    type="button"
                    text="Sign up"
                    classNames="text-white bg-[#124242] w-full py-2 rounded-sm cursor-pointer font-medium text-base hover:bg-teal-900 mb-5"
                />
                <p className=" w-full text-sm text-center">Already have an account? <NavLink className='text-teal-700 font-medium' to="/login">Log in</NavLink></p>
            </form>
        </AuthLayout>
    );
};

export default Signup;
