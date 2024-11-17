import React from 'react'
import { SignUp } from '@clerk/clerk-react'
const SignUpPage = () => {
  return (
    <div className='form-style'>
      <SignUp path="/sign-up" />
    </div>
  )
}

export default SignUpPage
