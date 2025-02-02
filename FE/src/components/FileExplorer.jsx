import document from "../assets/document.svg"

export default function FileExplorer({prop ,setUseState}){

  console.log(prop);

    return<>
        <div className="flex flex-col h-full w-1/4 bg-theme-black p-4 overflow-auto">
          {/* <h2 className="text-gray-200 mb-4">Files</h2> */}
          <ul className="space-y-2 ml-4">
            {prop.map((file) => (
              <li
                key={file.path}
                className="text-white cursor-pointer"
                onClick={() => setUseState(file)}
              >
              <div className="flex items-center gap-2">
                <img className="size-5 fill-white"src={document}></img>
                <div>{file.name}</div>
              </div>
              </li>
            ))}
          </ul>
        </div>
    </>
}