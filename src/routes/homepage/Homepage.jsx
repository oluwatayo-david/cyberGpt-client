import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <>
    <div className="relative flex flex-col items-center lg:h-full gap-0 lg:gap-16 lg:flex-row min-h-screen pt-11">
      <img src="/orbital.png" alt="" className="absolute bottom-0 left-0 opacity-[0.05] z-[-1] animate-rotateOrbital object-contain" />
      <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center ">
        <h1 className="text-transparent lg:text-title bg-gradient-to-r from-customColor1 to-customColor2 bg-clip-text text-titleMobile">
          CyberGpt
        </h1>

        <h2>Make everyday worth living</h2>
        <h3 className="font-extrabold lg:max-w-[70%] max-w-full ">
          CyberGpt is a smart chat bot  powered by gemini AI
        </h3>
        <Link to="/dashboard" className="px-5 py-4 text-white rounded-full bg-getStartedButton text-[14px] mt-10 hover:bg-white hover:text-[#217bfe] mb-10 lg:mb-0 ">Get Started</Link>
      </div>
      <div className="flex items-center justify-center flex-1 h-full pb-5 ">
        <div className="flex items-center justify-center bg-[#140e2d] rounded-[50px] w-[80%] h-[50%] relative">
          <div className="absolute top-0 left-0  w-full h-full overflow-hidden rounded-[50px]">
          <div className="w-full h-full bg-auto bg-custom opacity-20 animate-slideBg"></div>
          </div>
          <img src="/bot.png" alt=""   className="object-contain w-full h-full animate-botAnimate"
 />
<div className="hidden lg:flex absolute bottom-[-10px] lg:right-[-50px] items-center justify-center px-3 py-3 bg-[#2c2937] rounded[10px] right-0 rounded-lg gap-3">
<img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                    ? "/human2.jpeg"
                    : "bot.png"
              }
              alt=""
              className="w-[32px] h-[32px] rounded-[50%] object-cover"
            />
            <TypeAnimation
              sequence={[
                "Human:We produce food for Mice",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot:We produce food for Hamsters",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                "Human2:We produce food for Guinea Pigs",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot:We produce food for Chinchillas",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
     
    </div>
    <div className=" terms bottom-0   flex flex-col items-center gap-10">
        <img src="/logo.png" alt="" className="h-11 w-11"/>
        <div className="flex gap-9 text-[#888] text-[10px] ">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
                  </>
  );
};

export default Homepage;
