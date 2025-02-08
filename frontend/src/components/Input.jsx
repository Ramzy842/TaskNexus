const Input = ({label, type, placeholder, classNames, ...rest }) => {
	return (
		<div className="flex flex-col">
			<label className="mb-1 text-sm" htmlFor={label}>{label}</label>
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
