import { useState } from "react";
import eye_off from "../assets/visibility_eye_off.svg";
import eye from "../assets/visibility_eye_on.svg";

export function PassInput({label, placeholder, onChange}){

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return<>
        <div className="flex-col">
            <div className="mb-0.5 text-xs font-medium text-white text-left ">{label}</div>
            <div className="flex bg-[#262625] placeholder-[#545252] border border-[#545252] py-3 px-3 rounded-lg text-lg leading-[22px]">
                <input onChange={onChange} type={isPasswordVisible?"text":"password"} placeholder={placeholder} className="bg-[#262625] w-full text-white outline-none">
                </input>
                <button onClick={()=>{setIsPasswordVisible(!isPasswordVisible)}} className="relative">
                    <img src={isPasswordVisible?eye:eye_off}></img>
                </button>
            </div>
        </div>
    </>
}