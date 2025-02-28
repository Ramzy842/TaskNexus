import React from 'react'
import Button from './Button'

const AccountInfoCard = ({title, value}) => {
  return (
    <div className='flex'>
      <div className='flex flex-col'>
        <p>{title}</p>
        <p>{value}</p>
      </div>
      <Button text="Edit" type="button" classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer" />
    </div>
  )
}

export default AccountInfoCard
