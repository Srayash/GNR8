import { useEffect, useState } from "react";
import { Grid } from "../components/Grid";
import axios from "axios";
import { NavBar } from "../components/NavBar";
import { PromptBar } from "../components/PromptBar";
import { useRecoilState } from "recoil";
import { userStateAtom } from "../store/atoms/userState";
import { errorStateAtom } from "../store/atoms/errorState";
import { ErrorBlob } from "../components/ErrorBlob";

export function LandingPage(){

    const BASE_BE_URL = import.meta.env.VITE_BE_URL || "http://localhost:3000/api/v1"

    const [loading,setLoading] = useState(true);
    const [userState, setUserState] = useRecoilState(userStateAtom);
    const [error, setError] = useRecoilState(errorStateAtom);

    useEffect(() => {
        // Use Axios instead of fetch
            axios.get(`${BASE_BE_URL}/user_data`, {
                withCredentials: true, 
              })
              .then((response) => {
                const data = response.data;
                console.log(data.name);
                localStorage.setItem("name", data.name);
              })
              .catch((err) => {
                setError(err.response?.data?.message || err.message);
                localStorage.clear();
              })
              .finally(() => {
                setLoading(false);
              });

      }, []);
    return<>
        <div className="w-screen h-screen overflow-hidden bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,rgba(121,118,118,0.3),rgba(255,255,255,0))]">
            <Grid />
            <NavBar />
            <div className="flex-col justify-center items-center h-screen sm:text-7xl text-5xl text-center font-Bricolage transform translate-y-[12.5%]">
                <div>
                    <div>
                        <span className="text-white">What do you</span>
                    </div>
                    <div>
                        <span className="text-white">want to&nbsp;</span>
                        <span className="text-theme-purple-primary">create</span>
                        <span className="text-white">?</span>
                    </div>
                </div>
            </div>
            <div className="absolute top-2/4 w-full">
                <div className="flex w-full justify-center px-4">
                    <PromptBar/>
                </div>
            </div>
            <ErrorBlob message={error.text} />
        </div>
    </>
}