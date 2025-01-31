export default function ImprovementChat({conversation}){

    return<>
    <div className="flex flex-col mt-4 gap-2">
            {
        conversation.map((message, index)=>{
            return <div key={index}>
                <p>{message}</p>
            </div>
        })
    }
    </div>
    </>
}