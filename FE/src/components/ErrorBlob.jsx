import { useRecoilState } from "recoil"
import cross from "../assets/cross.svg"
import { errorStateAtom } from "../store/atoms/errorState"
import { useEffect, useState } from "react";

export function ErrorBlob({message}){
    
    const [errorState,setErrorState] = useRecoilState(errorStateAtom);
    const [visible, setVisible] = useState(errorState.visible);

    useEffect(()=>{
        setVisible(errorState.visible);
    },[errorState])

    if(!visible) return null

    return    <>
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-[#FF3D00] p-2.5 border border-[#FF6433] rounded-xl transition-transform duration-300`}
    >
      <div className="flex items-center gap-2.5">
        <p className="text-black">{message}</p>
        <button onClick={()=>setErrorState({visible: false,text: ""})}>
          <img src={cross} alt="close" />
        </button>
      </div>
    </div>
  </>
}