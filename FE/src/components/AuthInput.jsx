export function AuthInput({label, placeholder, onChange}){
    return<>
        <div className="flex-col">
            <div className="mb-0.5 text-xs font-medium text-white text-left">{label}</div>
            <input onChange={onChange} type="text" placeholder={placeholder} className="bg-[#262625] placeholder-[#545252] w-full py-3 px-3 border border-[#545252] text-white rounded-lg text-lg leading-[22px] outline-none"></input>
        </div>
    </>
}