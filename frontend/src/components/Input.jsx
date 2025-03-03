const Input = ({label, type, placeholder, labelClass, classNames, ...rest }) => {
	return (
		<div className="flex flex-col">
			<label className={window.location.pathname === "/settings" ? labelClass : "mb-1 text-sm"} htmlFor={label}>{label}</label>
			<input
				type={type}
				placeholder={placeholder}
				className={classNames}
				{...rest}
			/>
		</div>

	);
};

export default Input;
