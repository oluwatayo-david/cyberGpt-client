import React from 'react'
import { SignIn } from '@clerk/clerk-react'

const SignInPage = () => {
  return (
    <div className='form-style'>
      <SignIn path="/sign-in"  signUpUrl="/sign-up" />

    </div>
  )
}

export default SignInPage
