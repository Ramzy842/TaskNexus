const Input = ({ type, placeholder, classNames, ...rest }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={classNames}
            {...rest}
        />
    );
};

export default Input;
