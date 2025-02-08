const Input = ({ type, placeholder, classNames, ...rest }) => {
	return (
		<div>
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
