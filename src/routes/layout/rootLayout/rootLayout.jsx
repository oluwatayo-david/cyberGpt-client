import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton, ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Logo from '/public/logo.png';


// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const queryClient = new QueryClient();

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}
const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
  <QueryClientProvider client={queryClient}>
            <div className='flex flex-col md:pt-2 '>
                <header className='fixed top-0 z-50 items-center justify-between hidden w-full md:flex bg-contentColor'>
                    <Link to="/" className='flex items-center gap-3 font-bold hover:bg-transparent'>
                        <img src={Logo} alt="logo" className='w-10 h-10' />
                        <span>CyberGpt</span>
                    </Link>
                    <div> <SignedOut>
                        <SignInButton />
                    </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn></div>
                </header>

                <div className='flex-1 h-full overflow-hidden'>
                    <Outlet />
                </div>
            </div>
            </QueryClientProvider>
        </ClerkProvider>
    )
}

export default RootLayout
