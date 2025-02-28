import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const AccountInfo = () => {
    const user = useSelector((state) => state.user);
    // INFO STATE
    console.log(user);
    useEffect(() => {
        
    }, [user])
    const info = [
        { id: 0, title: "Name", value: user.user.name },
        { id: 1, title: "Username", value: user.user.username },
        { id: 2, title: "Email", value: user.user.email },
      ];
    
  return (
    <div>
       {info.map(el => {
        const {id, title, value} = el;
        return <div key={id}>
            <p>{title}</p>
            <p>{value}</p>
        </div>
       })} 
    </div>
  )
}

export default AccountInfo
