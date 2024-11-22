import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import './ChatList.css';
import { useQuery } from "@tanstack/react-query";
import { useAuth } from '@clerk/clerk-react';
import { Menu, X } from 'react-feather';
import Logo from '/public/logo.png';
import { ThreeDots } from "react-loader-spinner";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import Contactpage from '../../../routes/contactpage/contactpage';

const ChatList = () => {
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.json();
    },
  });
  
  
  const {pathname} = useLocation();
  const [activePath, setActivePath] = useState(pathname); // Use pathname for active state
  const { user } = useUser();
  const userName = user?.username;
  const email = user?.emailAddresses[0]?.emailAddress;

  // Update active path when location changes
  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  // Utility function to truncate text
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}....` : text;
  };

  // Function to determine if a link is active
  const isActive = (path) => activePath === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="relative flex-col hidden h-full border-r md:flex chatList border-r-slate-500/15">
        <div className="flex flex-col pl-2">
          <div className="flex flex-col h-full pt-16 pl-2 overflow-scroll scrollbar-hidden">
            <Link
              to="/dashboard"
              onClick={() => setActivePath("/dashboard")}
              className={`hover:text-white ${isActive("/dashboard") ? "bg-[#2c2937]" : ""}`}
            >
              Create a new Chat
            </Link>
            <Link
              to="/"
              onClick={() => setActivePath("/")}
              className={`hover:text-white ${isActive("/") ? "bg-[#2c2937]" : ""} my-1`}
            >
              Explore CyberGpt
            </Link>
            <Link
              to="/contact"
              onClick={() => setActivePath("/contact")}
              className={`hover:text-white ${isActive(`${Contactpage}`) ? "bg-[#2c2937]" : ""}`}
            >
              Contact
            </Link>

            <hr className="h-1 border-none bg-[#ddd] opacity-[0.1] rounded-[5px] my-2 mx-0" />
            <span className="font-bold title text-[10px] mb-3 border-b border-b-slate-500/15 pb-2">
              RECENT CHATS
            </span>
            <div className="flex overflow-y-scroll h-72 scrollbar-hidden">
              <div className="flex flex-col w-full gap-1 list">
                {isPending ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <ThreeDots height="80" width="80" color="#605e68" ariaLabel="loading" />
                  </div>
                ) : error ? (
                  <div className="text-red-500">Something went wrong!</div>
                ) : (
                  data?.slice().reverse().map((chat) => (
                    <Link
                      to={`/dashboard/chats/${chat._id}`}
                      key={chat._id}
                      onClick={() => setActivePath(`/dashboard/chats/${chat._id}`)}
                      className={`hover:text-white ${isActive(`/dashboard/chats/${chat._id}`) ? "bg-[#2c2937]" : ""}`}
                    >
                      {truncateText(chat.title, 27)}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
          <hr className="h-1 border-none bg-[#ddd] opacity-[0.1] rounded-[5px] mx-0" />
        </div>
        <div className="flex items-center gap-3 mt-auto text-xs upgrade">
          <img src="/logo.png" alt="" className="w-6 h-6" />
          <div className="flex flex-col texts">
            <span>Upgrade to Lama AI Pro</span>
            <span>Get unlimited access to all features</span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="z-50 md:hidden drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="flex items-center p-4">
          <label htmlFor="my-drawer" className="drawer-button">
            <Menu />
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="flex flex-col min-h-full p-4 text-white w-80 bg-contentColor">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-3 mb-2 font-bold title">
                <img src={Logo} alt="logo" className="w-6 h-6" />
                <span>CyberGpt</span>
              </div>
              <label htmlFor="my-drawer" aria-label="close sidebar" className="cursor-pointer drawer-overlay">
                <X />
              </label>
            </div>
            <Link
              to="/dashboard"
              onClick={() => setActivePath("/dashboard")}
              className={`hover:text-white ${isActive("/dashboard") ? "bg-[#2c2937]" : ""}`}
            >
              Create a new Chat
            </Link>
            <Link
              to="/"
              onClick={() => setActivePath("/")}
              className={`hover:text-white ${isActive("/") ? "bg-[#2c2937]" : ""} my-1`}
            >
              Explore CyberGpt
            </Link>
            <Link
              to="/contact"
              onClick={() => setActivePath("/contact")}
              className={`hover:text-white ${isActive("/contact") ? "bg-[#2c2937]" : ""}`}
            >
              Contact
            </Link>
            <hr className="h-1 border-none bg-[#ddd] opacity-[0.1] rounded-[5px] my-2 mx-0" />
            <span className="font-bold title text-[10px] mb-3 border-b border-b-slate-500/15 pb-2">
              RECENT CHATS
            </span>
            <div className="flex overflow-hidden h-60">
              <div className="flex flex-col w-full gap-1 overflow-scroll list scrollbar-hidden">
                {isPending ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <ThreeDots height="80" width="80" color="#605e68" ariaLabel="loading" />
                  </div>
                ) : error ? (
                  <div className="text-red-500">Something went wrong!</div>
                ) : (
                  data?.map((chat) => (
                    <Link
                      to={`/dashboard/chats/${chat._id}`}
                      key={chat._id}
                      onClick={() => setActivePath(`/dashboard/chats/${chat._id}`)}
                      className={`hover:text-white ${isActive(`/dashboard/chats/${chat._id}`) ? "bg-[#2c2937]" : ""}`}
                    >
                      {truncateText(chat.title, 27)}
                    </Link>
                  ))
                )}
              </div>
            </div>
            <hr className="h-1 border-none bg-[#ddd] opacity-[0.1] rounded-[5px] my-5 mx-0" />
            <div className="flex md:items-center gap-3 mt-auto text-[12px] upgrade flex-col">
              <div className="flex items-center gap-5">
                <div>
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
                <p className="text-md">{userName || email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatList;
