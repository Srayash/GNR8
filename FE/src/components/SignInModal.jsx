import { AuthInput } from "../components/AuthInput";
import Google from "../assets/Google.svg";
import { PassInput } from "./PassInput";
import axios from "axios";
import GitHub from "../assets/GitHub.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { errorStateAtom } from "../store/atoms/errorState";
import { userStateAtom } from "../store/atoms/userState";

export function SignInModal() {

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setErrorState = useSetRecoilState(errorStateAtom);
  const [userState, setUserState] = useRecoilState(userStateAtom);
  const navigate = useNavigate();


  async function handleGitHubLogin(){
    window.location.href = 'http://localhost:3000/auth/github';
  }

  async function  handleGoogleLogin(){
    window.location.href = 'http://localhost:3000/auth/google';
  }

  async function handleSignin() {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
        email,
        password,
      });
      const authHeader = response.headers.getAuthorization();
      const token = toString(authHeader.split(" ")[1]);
      console.log(token);
      if(!authHeader){
        navigate("/signin");
      }
      setUserState({
        name: response.data.name,
        token: token,
      })
      console.log(userState);
      localStorage.setItem("name", response.data.name);
      navigate("/");
    } catch (error) {
      if (error.response) {
        setErrorState({
          visible: true,
          text: error.response.data.message || "An error occurred",
        });
  
        setTimeout(() => {
          setErrorState({
            visible: false,
            text: "",
          });
        }, 5000);
      } else {
        console.error("Unexpected error:", error.message);
        setErrorState({
          visible: true,
          text: "Network error or server is unreachable",
        });
  
        setTimeout(() => {
          setErrorState({
            visible: false,
            text: "",
          });
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bg-theme-gray-primary rounded-xl border-2 border-[#484646] px-12 sm:py-16 py-12 sm:w-[475px]">
        <div className="flex flex-col gap-3.5">
          <AuthInput label={"Email address"} placeholder={"Input email address"} onChange={e=>setEmail(e.target.value)}/>
          <PassInput label={"Password"} placeholder={"********"} onChange={e=>setPassword(e.target.value)}/>
          <button
            className={`bg-theme-purple-primary border border-[#8133F1] hover:bg-theme-purple-secondary text-white w-full p-4 rounded-lg mt-0.5 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
            onClick={handleSignin}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
            <div className="flex items-center justify-center my-6">
                <div className="flex-1 border-t border-[#797676]"></div>
                    <span className="px-2 text-[#797676] text-sm font-light leading-[22px]">or</span>
                <div className="flex-1 border-t border-[#797676]"></div>
            </div>
            <div className="gap-3 flex flex-col">
        <button
          className="w-full flex items-center justify-center gap-x-3 p-4 border rounded-lg text-black bg-white"
          onClick={handleGoogleLogin}
        >
          <img src={Google} className="w-6 h-6" />
          Continue with Google
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-x-3 p-4 border-[#24292F] rounded-lg text-white bg-[#24292F]"
          onClick={handleGitHubLogin}
        >
          <img src={GitHub} className="w-6 h-6" />
          Continue with Github
        </button>
       </div>
      </div>
    </>
  );
}
