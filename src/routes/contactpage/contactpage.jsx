import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Contactpage = () => {
    const navigate = useNavigate()
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      coming soon......

<Link onClick={() => navigate(-1)} className='text-white text-xl'>
click to go back</Link>    </div>
  )
}

export default Contactpage
