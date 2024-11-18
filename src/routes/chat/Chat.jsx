import React, { useState } from "react";
import NewPrompt from "../../components/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IKImage } from "imagekitio-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Copy from "../../../public/copy.svg"
import Tick from "../../../public/tick.svg"


const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  const [copiedMessageId, setCopiedMessageId] = useState(null); // Track which message was copied
  const [copiedCodeId, setCopiedCodeId] = useState(null); // Track which code block was copied

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const handleCopy = (messageId, text) => {
    setCopiedMessageId(messageId);
    navigator.clipboard.writeText(text);
    setTimeout(() => setCopiedMessageId(null), 3000); // Reset "Copied" state after 3 seconds
  };

  const handleCopyCode = (codeId, text) => {
    setCopiedCodeId(codeId);
    navigator.clipboard.writeText(text);
    setTimeout(() => setCopiedCodeId(null), 3000); // Reset "Copied" state after 3 seconds
  };

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeText = String(children).replace(/\n$/, "");

      return !inline && match ? (
        <div className="relative group">
          <SyntaxHighlighter
            style={dracula}
            language={match[1]}
            PreTag="div"
            customStyle={{
              backgroundColor: "#1e1e1e",
              color: "#ffffff",
              padding: "1em",
              borderRadius: "5px",
            }}
            {...props}
          >
            {codeText}
          </SyntaxHighlighter>
          {/* Copy button for code blocks */}
          <button
            onClick={() => handleCopyCode(node.position.start.line, codeText)}
            className="absolute top-2 right-2 text-sm px-2 py-1 rounded bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copiedCodeId === node.position.start.line ? "Copied!" : "Copy code"}
          </button>
        </div>
      ) : (
        <code
          className={className}
          style={{ backgroundColor: "#1e1e1e", color: "#ffffff" }}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  const SkeletonChat = ({ isUser }) => (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} w-full mb-3`}
    >
      <div
        className={`py-1 px-10 rounded-full ${
          isUser ? "bg-[#2c2937] text-white" : "bg-[#2c2937]"
        }`}
      >
        <Skeleton count={2} style={{ marginBottom: "5px" }} />
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center h-full mx-auto chatPage">
      <div className="flex justify-center flex-1 w-full wrapper">
        <div className="flex justify-center w-full h-screen overflow-x-scroll scrollbar-hidden">
          <div className="flex flex-col w-full h-full gap-5 py-3 pt-16 md:w-1/2 chat">
            {isPending ? (
              <div>
                <SkeletonChat isUser={false} />
                <SkeletonChat isUser={true} />
                <SkeletonChat isUser={false} />
                <SkeletonChat isUser={true} />
                <SkeletonChat isUser={false} />
              </div>
            ) : error ? (
              <div>Something went wrong!</div>
            ) : (
              data?.history?.map((message, i) => (
                <React.Fragment key={i}>
                  {message.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={`relative group ${
                      message.role === "user" ? "message user" : "message"
                    }`}
                  >
                       <Markdown components={renderers}>
                      {message.parts[0].text}
                    </Markdown>
                    {/* Show Copy Button only for Model's responses */}
                    {message.role !== "user" && (
                     <div > <button
                     onClick={() => handleCopy(i, message.parts[0].text)}
                     className="bottom-0 left-1 text-sm px-2 py-1 rounded  text-white opacity-0 group-hover:opacity-100 transition-opacity "
                   >
                 <img
            src={
              copiedMessageId === i
                ? `${Tick}`
                : `${Copy}`
            }
            alt={copiedMessageId === i ?  `${Tick}` :  `${Copy}`}
            width={25}
            height={25}
          />
             
                   </button></div>
                    )}
                 
                  </div>
                </React.Fragment>
              ))
            )}
            {<NewPrompt data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;