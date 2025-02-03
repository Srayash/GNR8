import axios from "axios";
import { AuthInput } from "../components/AuthInput";
import Google from "../assets/Google.svg";
import { PassInput } from "./PassInput";
import { useState } from "react";
import GitHub from "../assets/GitHub.svg";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { errorStateAtom } from "../store/atoms/errorState";
import { userStateAtom } from "../store/atoms/userState";

export function SignUpModal() {

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const beUrl = isLocal ? 'http://localhost:8000' : 'https://gnr8-be.onrender.com';

  const [userState, setUserState] = useRecoilState(userStateAtom);

  async function handleGitHubLogin(){
    window.location.href = `${beUrl}/auth/github`;
  }

  async function  handleGoogleLogin(){
    window.location.href = `${beUrl}/auth/google`;
  }

  async function handleSignup(){
    try {
      const response = await axios.post(`${beUrl}/api/v1/user/signup`, {
        email,
        password,
        confirmPassword,
      });
      const authHeader = response.headers.getAuthorization();
      const token = authHeader.split(" ")[1];
      if(!authHeader){
        navigate("/signin");
      }
      setUserState({
        name: response.data.name,
        token: token,
      })
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
    }
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const setErrorState = useSetRecoilState(errorStateAtom);
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-theme-gray-primary rounded-xl border-2 border-[#484646] px-12 sm:py-16 py-12 sm:w-[475px]">
        <div className="flex flex-col gap-3.5">
          <AuthInput label={"Email address"} placeholder={"Input email address"} onChange={e=>setEmail(e.target.value)} />
          <PassInput label={"Set password"} placeholder={"********"} onChange={e=>setPassword(e.target.value)} />
          <PassInput label={"Confirm password"} placeholder={"********"} onChange={e=>setConfirmPassword(e.target.value)}/>
          <button
      className="bg-theme-purple-primary border border-[#8133F1] hover:bg-theme-purple-secondary text-white w-full p-4 rounded-lg mt-0.5"
      onClick={handleSignup}>
            Sign up
          </button>
        </div>
            <div className="flex items-center justify-center my-6">
                <div className="flex-1 border-t border-[#797676]"></div>
                    <span className="px-2 text-[#797676] text-sm font-light leading-[22px]">or</span>
                <div className="flex-1 border-t border-[#797676]"></div>
            </div>
            <div className="gap-3 flex flex-col">
              <button type="button"className="w-full flex items-center justify-center gap-x-3 p-4 border rounded-lg text-black bg-white" onClick={handleGoogleLogin}>
                  <img src={Google} className="w-6 h-6"></img>
                  Continue with Google
              </button>
              <button type="button" className="w-full flex items-center justify-center gap-x-3 p-4 border-[#24292F]rounded-lg text-white bg-[#24292F] rounded-lg" onClick={handleGitHubLogin}>
                <img src={GitHub} className="w-6 h-6"></img>
                  Continue with Github
              </button>
            </div>
      </div>
    </>
  );
}
