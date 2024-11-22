import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Upload from "./upload";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import model from "../lib/gemini";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ThreeDots } from "react-loader-spinner";
import { useAuth } from "@clerk/clerk-react";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [isStopped, setIsStopped] = useState(false); // Added state to handle stopping
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: data?.history?.length
      ? data.history.map(({ role, parts }) => ({
          role,
          parts: [{ text: parts[0].text }],
        }))
      : [{ role: "user", parts: [{ text: "Hello!" }] }],
    generationConfig: {},
  });

  const endRef = useRef(null);
  const formRef = useRef(null);
  const abortControllerRef = useRef(null); // AbortController ref to handle stopping

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Authentication token is missing");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question || undefined,
            answer,
            img: img.dbData?.filePath || undefined,
          }),
        }
      );
      if (!response.ok) throw new Error(`Failed to update chat: ${response.statusText}`);

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] }).then(() => {
        formRef.current.reset();
        setQuestion("");
        setAnswer("");
        setImg({ isLoading: false, error: "", dbData: {}, aiData: {} });
      });
    },
    onError: (err) => {
      console.error("Error updating chat:", err);
      alert("Failed to update chat. Please try again.");
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    setIsLoadingResponse(true);
    setIsStopped(false);
    abortControllerRef.current = new AbortController(); // Create a new controller for each request

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text],
        { signal: abortControllerRef.current.signal } // Pass signal to handle stopping
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        if (isStopped) break; // Stop the response if the user requests
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
      mutation.mutate();
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Response stopped by user.");
      } else {
        console.error(err);
      }
    }
    setIsLoadingResponse(false);
  };

  const handleStop = () => {
    setIsStopped(true); // Stop state
    abortControllerRef.current?.abort(); // Abort the ongoing stream
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;

    setQuestion(text);
    setAnswer(""); // Clear previous answer
    add(text, false); // Trigger response
  };

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
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
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} style={{ backgroundColor: "#1e1e1e", color: "#ffffff" }} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <>
      {img.isLoading && (
        <div className="flex justify-end">
          <Skeleton
            width={380}
            height={380}
            style={{
              borderRadius: "10px",
              backgroundColor: "#2c2937",
            }}
          />
        </div>
      )}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          height="380"
          transformation={[{ width: 400 }]}
          className="flex self-end"
        />
      )}
      {question && <div className="message user">{question}</div>}
      {isLoadingResponse && !isStopped && (
        <div className="flex items-center justify-start">
          <ThreeDots height="15" width="40" radius="9" color="#605e68" ariaLabel="three-dots-loading" visible={true} />
        </div>
      )}
      {answer && (
        <div className="message">
          <Markdown components={renderers}>{answer}</Markdown>
        </div>
      )}
      <div className="pb-24 endChat" ref={endRef}></div>

      <form
        className="absolute bottom-0 md:w-1/2 newForm bg-[#2c2937] rounded-lg flex items-center px-5 w-full"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden className="inputs" />
        <input type="text" name="text" placeholder="Ask anything..." className="inputs" />
        <button
          type="button"
          className="rounded-md bg-[#605e68] border-none p-2 flex items-center justify-center cursor-pointer"
          onClick={isLoadingResponse ? handleStop : handleSubmit}
        >
          {isLoadingResponse ? "Stop" : <img src="/arrow.png" alt="" className="w-4 h-4" />}
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
