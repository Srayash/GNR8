import { useEffect, useState } from "react";
import FileExplorer from "../components/FileExplorer";
import transformToFileStructure from "../utils/transformerFunction"
import parseContent from "../utils/parserFunction";
import { useRecoilValue } from 'recoil';
import { predictionStateAtom } from '../store/atoms/predictionState';
import WebsitePreview from "../components/WebsitePreview";
import CodeEditor from "../components/CodeEditor";
import ResultNav from "../components/resultNav";
import { previewStateAtom } from "../store/atoms/previewState";
import ResultSideBar from "../components/ResultSideBar";

export function ResultPage(){

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const isPreviewing = useRecoilValue(previewStateAtom);

  const prediction = useRecoilValue(predictionStateAtom);
  const fileContent = parseContent(prediction);

  useEffect(()=>{
    if(fileContent){
      const transformedFiles = transformToFileStructure(fileContent);
      setFiles(transformedFiles);
    }
  },[]);

  return <>
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      {/* <NavBar /> */}
      <div className="flex flex-1">
        <ResultSideBar props={fileContent} />
        <div className="flex flex-1 flex-col">
          <ResultNav />
          {!isPreviewing?<WebsitePreview content={prediction} />:
          <div className="flex flex-1">
            <FileExplorer prop={files} setUseState={setSelectedFile}/>
            <CodeEditor file={selectedFile}/>
          </div>
          }
        </div>
      </div>
    </div>
  </>
}