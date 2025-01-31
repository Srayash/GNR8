export default function QuickActionHeader({source, heading}){
    return <>
        <div className="flex gap-3">
        <img src={source}/>
        <p>{heading}</p>
       </div>
    </>
}