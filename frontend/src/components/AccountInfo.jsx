import { useState } from "react";
import { useSelector } from "react-redux";
import AccountInfoCard from "./AccountInfoCard";

const AccountInfo = () => {
    const user = useSelector((state) => state.user.user);
    const isEditingLoading = useSelector(
        (state) => state.user.isEditingLoading
    );
    
    const [info, setInfo] = useState(
        !isEditingLoading && user
            ? [
                  {
                      id: 0,
                      title: "Name",
                      value: user.name,
                      placeholder: "Enter your new name",
                  },
                  {
                      id: 1,
                      title: "Username",
                      value: user.username,
                      placeholder: "Enter your new username",
                  },
                  {
                      id: 2,
                      title: "Email",
                      value: user.email,
                      placeholder: "Enter your new email",
                  },
              ]
            : []
    );

    console.log("Rendering parent AccountInfo");
    return (
        <div className="mb-4">
            {info.map((el) => {
                const { id, title, value, placeholder } = el;
                return (
                    <AccountInfoCard
                        info={info}
                        setInfo={setInfo}
                        key={id}
                        placeholder={placeholder}
                        title={title}
                        value={value}
                    />
                );
            })}
        </div>
    );
};

export default AccountInfo;
