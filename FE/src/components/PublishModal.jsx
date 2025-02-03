import { useRecoilState } from "recoil";
import { publishModalStateAtom } from "../store/atoms/publishModalState";
import { useEffect, useState } from "react";
import copy from "../assets/copy.svg";
import cross from "../assets/cross_white.svg";

export function PublishModal() {
    const [modalState, setModalState] = useRecoilState(publishModalStateAtom);
    const [visible, setVisible] = useState(modalState.visible);

    useEffect(() => {
        setVisible(modalState.visible);
    }, [modalState]);

    if (!visible) return null;

    const onCopy = () => {
        navigator.clipboard.writeText(modalState.url)
            .then(() => {
                alert("Copied to clipboard!");
            })
            .catch(err => console.error("Failed to copy text: ", err));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-theme-black rounded-xl border-2 border-[#484646] p-6 w-[420px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Website Published!</h2>
                    <button className="text-white px-1 py-1 border-[#313030] border rounded-xl" onClick={() => setModalState({ visible: false, url: "" })}>
                        <img src={cross} className="size-6" alt="close" />
                    </button>
                </div>
                <div className="mb-0.5 text-xs font-medium text-white text-left mt-8">Website is Live at:</div>
                <div className="flex border border-theme-gray-secondary rounded-xl overflow-hidden w-full">
                    <input 
                        type="text" 
                        value={modalState.url} 
                        readOnly 
                        className="bg-[#262625] placeholder-[#545252] flex-1 py-3 px-3 text-white rounded-s-lg text-base leading-[22px] outline-none w-full"
                    />
                    <button 
                        onClick={onCopy} 
                        className="bg-theme-purple-primary hover:bg-theme-purple-secondary text-white rounded-e-xl"
                    >
                        <img src={copy} alt="copy" />
                    </button>
                </div>
                <div className="mb-0.5 text-xs font-medium text-white text-left mt-8"><p>Your website has been deployed successfully! If the link provided doesn&#39;t load immediately, it might still be building. Please wait a few minutes and then refresh the page.</p></div>
            </div>
        </div>
    );
}
