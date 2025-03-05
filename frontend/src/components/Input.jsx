const Input = ({
  src,
  label,
  type,
  placeholder,
  labelClass,
  classNames,
  children,
  showPassword,
  setShowPassword,
  ...rest
}) => {
  return (
    <div className="flex flex-col mb-4 relative ">
      <label className={`mb-1 text-sm ${labelClass}`} htmlFor={label}>
        {label}
      </label>
      <div className={`flex items-center w-full ${localStorage.getItem("id") && "md:w-sm"} bg-white border border-transparent focus-within:border-teal-400 rounded-sm`}>
        {src && (
          <img src={src} className="w-4 h-4 ml-2 " alt={`${label} icon`} />
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={classNames}
          {...rest}
        />
        {/\bpassword\b/i.test(label) && (
          <img
            onClick={() => setShowPassword(!showPassword)}
            src={
              showPassword ? "./src/assets/show.svg" : "./src/assets/hide.svg"
            }
            className="h-5 cursor-pointer z-2 mx-2 "
            alt="hide/show password"
          />
        )}
      </div>
    </div>
  );
  //localStorage.getItem("id") ? (
  //   <div className="flex flex-col">
  //     <label
  //       className={
  //         window.location.pathname === "/settings" ? labelClass : "mb-1 text-sm"
  //       }
  //       htmlFor={label}
  //     >
  //       {label}
  //     </label>
  //     <input
  //       type={type}
  //       placeholder={placeholder}
  //       className={classNames}
  //       {...rest}
  //     />
  //   </div>
  // ) : (
  //   <div className="flex flex-col mb-4 relative">
  //     <label
  //       className="mb-1 text-sm"
  //       htmlFor={label}
  //     >
  //       {label}
  //     </label>
  //     <div className="flex items-center bg-white border border-transparent focus-within:border-teal-400 rounded-sm">
  //       {src && (
  //         <img src={src} className="w-4 h-4 ml-2 " alt={`${label} icon`} />
  //       )}
  //       <input
  //         type={type}
  //         placeholder={placeholder}
  //         className={classNames}
  //         {...rest}
  //       />
  //       {label === "Password" && (
  //         <img
  //           onClick={() => setShowPassword(!showPassword)}
  //           src={
  //             showPassword ? "./src/assets/show.svg" : "./src/assets/hide.svg"
  //           }
  //           className="h-5 cursor-pointer z-2 mx-2 "
  //           alt="hide/show password"
  //         />
  //       )}
  //     </div>
  //   </div>
  // );
};

export default Input;
