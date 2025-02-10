import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <AuthLayout>
            <form action="#" className="flex flex-col items-center">
                <h1 className="font-semibold text-4xl self-start text-[#0A2D29] mb-4 self-start py-2">
                    Log in
                </h1>
                <Input
                    label="Email"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black px-2 py-1 rounded-sm text-xl mb-4  text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder=""
                    classNames="bg-white text-black px-2 py-1 rounded-sm text-xl mb-2 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className="w-full text-end text-xs mb-4 font-normal">
                    Forgot your password?
                </p>
                <Button
                    type="button"
                    text="Log in"
                    classNames="text-white bg-[#124242] w-full py-2 rounded-sm cursor-pointer font-medium text-base hover:bg-teal-900"
                />
                <p className="font-normal text-[#124242] text-sm my-4">Or continue with</p>
                <div className="border w-full py-2 px-4 hover:bg-white group rounded-sm flex justify-center items-center">
                    <img src="./src/assets/google.svg" alt="google login" />
                    <Button
                        type="button"
                        text="Log in with Google"
                        classNames=" bg-transparent text-[#124242] w-full  cursor-pointer font-medium text-sm "
                    />
                </div>

            </form>
        </AuthLayout>
    );
};

export default Login;
