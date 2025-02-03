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

    const [loading,setLoading] = useState(true);
    const [userState, setUserState] = useRecoilState(userStateAtom);
    const [error, setError] = useRecoilState(errorStateAtom);

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    const beUrl = isLocal ? 'http://localhost:8000' : 'https://gnr8-be.onrender.com';

    useEffect(() => {
        // Use Axios instead of fetch
            axios.get(`${beUrl}/api/v1/user_data`, {
                withCredentials: true, 
              })
              .then((response) => {
                const data = response.data;
                const authHeader = response.headers.getAuthorization(); 
                const token = authHeader.split(" ")[1];
                localStorage.setItem("token", token);
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