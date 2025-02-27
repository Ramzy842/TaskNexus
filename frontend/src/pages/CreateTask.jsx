import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import TaskCreate from '../components/TaskCreate'
import { useDispatch } from 'react-redux'
import { resetTaskCreation } from '../redux/actions/taskActions'

const CreateTask = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(resetTaskCreation())
    }, [dispatch])
  return (
    <DashboardLayout>
        <TaskCreate  />
    </DashboardLayout>
  )
}

export default CreateTask
