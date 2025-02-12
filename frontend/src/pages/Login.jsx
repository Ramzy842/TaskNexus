import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <AuthLayout>
            <form action="#" className="flex flex-col md:max-w-xs md:w-full">
                <h1 className="font-semibold text-4xl self-start text-[#0A2D29] mb-4 self-start py-2">
                    Log in
                </h1>
                <Input
                    label="Email"
                    type="text"
                    placeholder=""
                    classNames="bg-white text-black px-2 py-1 block rounded-sm text-xl mb-4 w-full text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="mb-3 relative">
                    <Input
                        label="Password"
                        type="password"
                        placeholder=""
                        classNames="bg-white text-black px-2 pr-12 py-1 block rounded-sm text-xl w-full text-sm flex-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src="./src/assets/eye.svg" className="absolute bottom-1.5 h-6 right-1.5 cursor-pointer z-2 bg-white " alt="hide/show password" />
                </div>

                <p className="w-full text-end text-xs mb-4 font-normal cursor-pointer">
                    Forgot your password?
                </p>
                <Button
                    type="button"
                    text="Log in"
                    classNames="text-white bg-[#124242] w-full py-2 rounded-sm cursor-pointer font-medium text-base hover:bg-teal-900"
                />
                <div className="flex flex-col items-center">
                    <p className="font-normal bg-[#C2D0CE] z-2 text-[#124242] text-sm my-4 text-center px-2">Or continue with</p>
                    <div className="h-[1px] bg-teal-900 w-full relative bottom-6"></div>
                </div>

                <div className="border border-[#124242] w-full py-2 px-4 hover:bg-white group rounded-sm flex justify-center items-center cursor-pointer">
                    <img src="./src/assets/google.svg" alt="google login" />
                    <Button
                        type="button"
                        text="Log in with Google"
                        classNames=" bg-transparent text-[#124242] group-hover:cursor-pointer w-full h-full bg-red-400 text-center font-medium text-sm "
                    />
                </div>

            </form>
        </AuthLayout>
    );
};

export default Login;
