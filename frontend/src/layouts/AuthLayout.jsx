const AuthLayout = ({ children }) => {
    return (
        <div className="grid grid-rows-[auto_1fr] h-screen">
            <div className="bg-[#144B4B] w-full flex justify-center items-center">
                <p className="font-radCan text-[#E3EAE9] text-3xl font-bold uppercase">
                    TaskNexus
                </p>
            </div>
            {children}
        </div>
    );
};

export default AuthLayout;
