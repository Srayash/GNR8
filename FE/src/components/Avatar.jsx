export function Avatar(){
    const name = localStorage.getItem("name");
    const greeting =  name.split('@')[0][0].toUpperCase() + name.split('@')[0].slice(1);
    return <>
        <div className="flex items-center gap-4 font-Bricolage">
            <div>
                <p className="text-theme-gray-secondary ">Hey, {greeting}</p>
            </div>
            <div className="bg-theme-purple-primary border border-theme-purple-secondary rounded-full">
                <div className="flex flex-col justify-center items-center h-8 w-8 text-xl">
                    {name[0].toUpperCase()}
                </div>
            </div>
        </div>
    </>

}