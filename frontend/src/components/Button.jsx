const Button = ({ text, type, classNames, ...rest }) => {
    return (
        <button type={type} className={classNames} {...rest}>
            {text}
        </button>
    );
};

export default Button;
