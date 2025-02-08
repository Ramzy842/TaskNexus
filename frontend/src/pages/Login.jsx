import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";

const Login = () => {
	return (
		<AuthLayout>
			<form action="#">
				<h1 className="font-semibold text-4xl self-start text-[#0A2D29] mb-4 self-start py-2">Log in</h1>
				<Input label="Email" type="text" placeholder="" classNames="bg-white text-black px-2 py-1 rounded-sm text-xl mb-4 " />
				<Input label="Password" type="password" placeholder="" classNames="bg-white text-black px-2 py-1 rounded-sm text-xl mb-2" />
				<p className="w-full text-end text-xs mb-4 font-normal">Forgot your password?</p>
				<Button type="button" text="Log in" classNames="text-white bg-[#124242] w-full py-2 rounded-sm cursor-pointer font-medium text-base" />
			</form>
		</AuthLayout>
	);
};

export default Login;
