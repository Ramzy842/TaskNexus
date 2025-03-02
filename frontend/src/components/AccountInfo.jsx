import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccountInfoCard from "./AccountInfoCard";

const AccountInfo = () => {
  const user = useSelector((state) => state.user);
  const [info, setInfo] = useState([]);
  useEffect(() => {
    if (user.user) {
      setInfo([
        { id: 0, title: "Name", value: user.user.name, placeholder: "Enter your new name" },
        { id: 1, title: "Username", value: user.user.username, placeholder: "Enter your new username" },
        { id: 2, title: "Email", value: user.user.email, placeholder: "Enter your new email" },
      ]);
    }
  }, [user]);
  if (user.loading) return <h1>Loading settings...</h1>;
  return (
    <div className="mb-4">
      {info.map((el) => {
        const { id, title, value, placeholder } = el;
        return <AccountInfoCard key={id} placeholder={placeholder} title={title} value={value} />
      })}
    </div>
  );
};

export default AccountInfo;
