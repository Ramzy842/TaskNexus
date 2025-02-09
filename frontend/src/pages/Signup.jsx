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
            <form action="#">
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
                <Input
                    label="Password"
                    type="password"
                    placeholder=""
                    classNames="bg-white text-black px-2 py-1 rounded-sm text-xl mb-4 text-sm text-teal-900 outline-teal-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                
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
