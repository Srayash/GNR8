import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import arrow_fwd from "../assets/arrow_fwd.svg";
import arrow_back from "../assets/back.svg";
import ImprovementChat from "./ImprovementChat";
import Toolbar from "./Toolbar";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { predictionStateAtom } from "../store/atoms/predictionState";
import { errorStateAtom } from "../store/atoms/errorState";

export default function ResultSideBar({ brief }) {
  const BASE_BE_URL = import.meta.env.VITE_BE_URL || "http://localhost:3000/api/v1"
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const navigate = useNavigate();
  const setPrediction = useSetRecoilState(predictionStateAtom);
  const setErrorState = useSetRecoilState(errorStateAtom);

  useEffect(() => {
    if (brief?.message) {
      setMessages((prevMessages) => [...prevMessages, brief.message]);
    }
  }, [brief]);

  const handleChatToggle = (openChat) => {
    setIsChatOpen(openChat);
  };

  async function handleSubmit(e) {
    e.preventDefault();
  
    setIsLoading(true);
    setPrompt("");
  
    try {
      const response = await axios.post(`${BASE_BE_URL}/generate/improvement`, {
        prompt
      }, {
        withCredentials:true,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setPrediction(response.data.data.updated_code);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/signin");
      setErrorState({
        visible: true,
        text: "Sign in to continue GNR8ing",
      });
      setTimeout(() => {
        setErrorState({
          visible: false,
          text: "",
        });
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-1/4 flex-col justify-between bg-theme-black text-white py-3 px-4 border-[#313030] border-r">
      {/* Navigation buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="bg-theme-gray-primary rounded-full p-2.5 border border-[#313030]"
        >
          <img className="size-4" src={arrow_back} alt="Back" />
        </button>
        <div className="flex px-1.5 py-1 bg-theme-gray-primary border-[#313030] text-white gap-2.5 rounded-xl">
          <button
            onClick={() => handleChatToggle(true)}
            className={`py-2 px-2.5 rounded-xl ${isChatOpen ? "bg-theme-purple-primary border border-theme-purple-secondary" : "bg-theme-gray-primary"}`}
          >
            <p className="text-base leading-4">Chat</p>
          </button>
          <button
            onClick={() => handleChatToggle(false)}
            className={`py-2 px-2.5 rounded-xl ${!isChatOpen ? "bg-theme-purple-primary border border-theme-purple-secondary" : "bg-theme-gray-primary"}`}
          >
            <p className="text-base leading-4">Quick Actions</p>
          </button>
        </div>
      </div>

      {/* Chat or Toolbar based on isChatOpen */}
      <div className="flex h-full flex-col justify-between gap-2 py-3">
        {isChatOpen ? <ImprovementChat conversation={messages} /> : <Toolbar />}
      </div>

      {/* Form for follow-up prompts */}
      {isChatOpen && (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-start justify-between bg-theme-gray-primary text-white px-2 py-3 rounded-xl border-[1px] border-[#313030]">
            <textarea
              type="text"
              placeholder={isLoading ? "Re-GNR8-ing..." : "Ask me a follow-up"}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-transparent resize-none flex-grow outline-none placeholder-theme-gray-secondary"
            />
            <button
              type="submit"
              className="relative bg-[#3c3b3b] text-white p-1 rounded-md"
              aria-label="Submit"
            >
              <img src={arrow_fwd} className="size-4" alt="Submit" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
