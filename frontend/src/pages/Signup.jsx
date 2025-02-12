import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <AuthLayout>
            <form action="#" className="flex flex-col  md:max-w-xs md:w-full">
                <h1 className="font-semibold text-4xl self-start text-[#0A2D29] mb-4 self-start py-2">
                    Sign up
                </h1>
                <Input
                    label="Username"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black px-2 py-1 rounded-sm text-xl mb-4  text-sm text-teal-900 outline-teal-600"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    label="Name"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black px-2 py-1 rounded-sm text-xl mb-4  text-sm text-teal-900 outline-teal-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Email"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black px-2 py-1 rounded-sm text-xl mb-4  text-sm text-teal-900 outline-teal-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="relative mb-4">
                    <Input
                        label="Password"
                        type="password"
                        placeholder=""
                        classNames="bg-white text-black px-2 py-1 rounded-sm text-xl text-sm pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src="./src/assets/eye.svg" className="absolute bottom-1.5 h-6 right-1.5 cursor-pointer z-2 " alt="hide/show password" />
                </div>
                
                <Button
                    type="button"
                    text="Sign up"
                    classNames="text-white bg-[#124242] w-full py-2 rounded-sm cursor-pointer font-medium text-base hover:bg-teal-900"
                />
            </form>
        </AuthLayout>
    );
};

export default Signup;
