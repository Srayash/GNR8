import { useEffect, useState } from "react";
import FileExplorer from "../components/FileExplorer";
import transformToFileStructure from "../utils/transformerFunction"
import parseContent from "../utils/parserFunction";
import { useRecoilState, useRecoilValue } from 'recoil';
import { predictionStateAtom } from '../store/atoms/predictionState';
import WebsitePreview from "../components/WebsitePreview";
import CodeEditor from "../components/CodeEditor";
import ResultNav from "../components/resultNav";
import { previewStateAtom } from "../store/atoms/previewState";
import ResultSideBar from "../components/ResultSideBar";
import { ErrorBlob } from "../components/ErrorBlob";
import JSZip from "jszip";
import { errorStateAtom } from "../store/atoms/errorState";

export function ResultPage(){

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const isPreviewing = useRecoilValue(previewStateAtom);
  const [error, setError] = useRecoilState(errorStateAtom);

  const prediction = useRecoilValue(predictionStateAtom);
  const fileContent = parseContent(prediction);

  useEffect(()=>{
    const Content = parseContent(prediction);
    if(Content){
      const transformedFiles = transformToFileStructure(Content);
      setFiles(transformedFiles);
    }
  },[prediction]);

  const onCopy = () => {
    const copiedContent = selectedFile.content;
    navigator.clipboard.writeText(copiedContent)
      .then(() => {
        setError({
          visible: true,
          text: `Copied ${selectedFile.name} to clipboard`,
        });

        setTimeout(() => {
          setError({
            visible: false,
            text: "",
          });
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }

  const onDownload = () => {
      const zip = new JSZip();
      files.forEach(file => {
        zip.file(file.name, file.content);
      });

    zip.generateAsync({ type: "blob" })
      .then(blob => {
        // Create a download link for the zip file.
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "files.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
    .catch(err => console.error("Error generating ZIP file: ", err));
  }

  return <>
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      {/* <NavBar /> */}
      <div className="flex flex-1">
        <ResultSideBar props={fileContent} />
        <div className="flex flex-1 flex-col">
          <ResultNav onCopy={onCopy} onDownload={onDownload} />
          {!isPreviewing?<WebsitePreview />:
          <div className="flex flex-1">
            <FileExplorer prop={files} setUseState={setSelectedFile}/>
            <CodeEditor file={selectedFile}/>
          </div>
          }
        </div>
      </div>
      <ErrorBlob message={error.text} />
    </div>
  </>
}