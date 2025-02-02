import { useRecoilState } from "recoil"
import { previewStateAtom } from "../store/atoms/previewState"
import copy from "../assets/copy.svg"
import deploy from "../assets/Frame.svg"
import download from "../assets/download.svg"

export default function ResultNav({onCopy, onDownload}){

    const [isPreviewing, setIsPreviewing] = useRecoilState(previewStateAtom);

    return<>
        <div className="flex justify-between py-3 px-4 border-[#313030] border-b">
            <div className="flex px-1.5 py-1 bg-theme-gray-primary border-[#313030] text-white gap-2.5 rounded-xl">
                <button onClick={()=>{setIsPreviewing(true)}} className={`py-2 px-2.5 rounded-xl ${isPreviewing?"bg-theme-purple-primary border border-theme-purple-secondary":"bg-theme-gray-primary"}`}><p className="text-base leading-4">code</p></button>
                <button onClick={()=>{setIsPreviewing(false)}} className={`py-2 px-2.5 rounded-xl ${isPreviewing?"bg-theme-gray-primary":"bg-theme-purple-primary border border-theme-purple-secondary"}`}><p className="text-base leading-4">preview</p></button>
            </div>
            <div className="flex gap-2.5">
                {isPreviewing?
                    <button onClick={onCopy} className="text-white px-0.5 border-[#313030] border rounded-xl"><img className="size-10" src={copy}/></button>
                :null}
                <button onClick={onDownload} className="text-white px-0.5 border-[#313030] border rounded-xl"><img className="size-10"src={download}/></button>
                <button className="flex items-center gap-1 text-white px-2 py-1 border-theme-purple-secondary bg-theme-purple-primary border rounded-xl"><p className="text-base leading-4">Publish</p><img className="size-6" src={deploy}/></button>
            </div>
        </div>
    </>
}