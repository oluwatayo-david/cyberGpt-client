import React, { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import ChatList from '../../../components/chatlist/ChatList/ChatList'
const DashboardLayout = () => {
    const navigate = useNavigate()
    const { userId, isLoaded } = useAuth()

    useEffect(() => {
        if (isLoaded && !userId) {
            navigate('/sign-in')
        }
    }, [userId, navigate, isLoaded])

    // if (!isLoaded) return <div>...loading</div>

    return (
        <div className='flex-col h-screen pt-2 md:flex md:flex-row'>
            <div className='fixed top-0 z-50 w-full md:flex-1 md:z-0 md:relative bg-contentColor md:w-1/2'>
               <ChatList/>
            </div>

            <div className='md:flex-[4] bg-contentColor w-full px-2'>
                <Outlet />

            </div> 
        </div>
    )
}

export default DashboardLayout
