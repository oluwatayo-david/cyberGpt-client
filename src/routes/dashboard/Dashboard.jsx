import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const DashboardPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
 const mutation = useMutation({
  mutationFn: (text) => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to create chat");
      return res.json();
    });
  },
  onSuccess: (id) => {
    queryClient.invalidateQueries({ queryKey: ["userChats"] });
    navigate(`/dashboard/chats/${id}`);
  },
  onError: (error) => {
    console.error("Error creating chat:", error);
    alert("Failed to create chat. Please try again.");
  },
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };
  return (
    <div className="flex flex-col items-center md:h-full pb-3 dashboardPage !h-screen ">
      <div className="flex flex-col items-center justify-center flex-1 md:w-1/2 texts gap-[50px]  w-full">
        <div className="flex items-center logo gap-[20px] opacity-[0.2] ">
          <img src="/logo.png" alt=""  className="w-16 h-16"/>
          <h1 className="text-transparent md:text-[64px] bg-gradient-to-r from-customColor1 to-customColor2 bg-clip-text text-titleMobile hidden md:flex">CyberGpt</h1>
        </div>
        <div className="w-full px-3">
          <div className="flex items-center w-full gap-5 overflow-scroll md:gap-10 scrollbar-hidden">

          <div className="option ">
            <img src="/chat.png" alt="" />
            <span>Create a New Chat</span>
          </div>
          <div className="option ">
            <img src="/image.png" alt="" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Help me with my Code</span>
          </div>
          </div>
        </div>
      </div>
      <div className="md:w-1/2 lg:mt-auto  bg-[#2c2937] rounded-md flex  w-full ">
        <form  className="flex items-center justify-between w-full h-full gap-5 mb-2 " onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..."  className="flex-1 p-3 bg-transparent border-none outline-none text-[#ececec]"/>
          <button className="bg-gray-500 rounded-[50%] border-none cursor-pointer p-2 flex items-center justify-center mr-5">
            <img src="/arrow.png" alt=""  className="w-4 h-4"/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;