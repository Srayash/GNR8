import { useState,useEffect } from "react";
import arrowLeft from "../assets/arrow_fwd.svg";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { predictionStateAtom } from "../store/atoms/predictionState";
import { useNavigate } from "react-router-dom";
import { predictionLoadingStateAtom } from "../store/atoms/predictionLoadingState";
import { errorStateAtom } from "../store/atoms/errorState";

export function PromptBar() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useRecoilState(predictionLoadingStateAtom);
  const [errorState, setErrorState] = useRecoilState(errorStateAtom);
  const navigate = useNavigate();
  const setPrediction = useSetRecoilState(predictionStateAtom);

  async function handleSubmit(e) {
    e.preventDefault();
  
    setIsLoading(true);
    setPrompt("");
  
    try {
      const response = await axios.post("http://localhost:3000/api/v1/generate/", {
        prompt
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setPrediction(response.data.data[0]);
      navigate("/result");
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
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div
        className={
          `flex items-center justify-between bg-theme-gray-primary text-white 
           px-2 py-3 rounded-xl border 
           transition-colors duration-300 border-[#313030]`
        }
      >
        <input
          type="text"
          placeholder="Build me a ..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={`bg-transparent flex-grow outline-none placeholder-theme-gray-secondary`}
        />
        <button
          type="submit"
          className="relative bg-[#3c3b3b] text-white p-1 rounded-md"
          aria-label="Submit"
        >
          <img src={arrowLeft} className="size-4" alt="Submit"/>
        </button>
      </div>
    </form>
  );
}
