import { useNavigate } from "react-router-dom"
import logo from "../assets/GNR8.svg"
import { Avatar } from "./Avatar";

export function NavBar(){

    const navigate = useNavigate();
    const initial = localStorage.getItem("name");

    return <>
        <div className="w-full h-50 text-white">
            <div className="z-10 px-5 py-2 w-full flex align-middle justify-between">
                <button onClick={()=> navigate("/")}><img className="cursor-pointer" src={logo}></img></button>
                { initial?<Avatar /> :<div className="flex justify-between gap-4">
                    <button onClick={() => navigate("/signin")} className="px-3 py-2 bg-theme-gray-primary border-[1px] rounded-xl border-[#313030] text-theme-gray-secondary">
                        sign in
                    </button>
                    <button onClick={() => navigate("/signup")} className="px-3 py-2 bg-theme-purple-primary border-[1px] rounded-xl border-theme-purple-secondary">
                        sign up
                    </button>
                </div>
                }

            </div>
        </div>
    </>
}