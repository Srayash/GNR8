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
import axios from "axios";
import { errorStateAtom } from "../store/atoms/errorState";
import { publishModalStateAtom } from "../store/atoms/publishModalState";
import { PublishModal } from "../components/PublishModal";

export function ResultPage(){


  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const beUrl = isLocal ? 'http://localhost:8000' : 'https://gnr8-be.onrender.com';
  const [files, setFiles] = useState([]);
  const [publishModal, setPublishModal] = useRecoilState(publishModalStateAtom);
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

  const onPublish = async () => {

    try {

      setError({
        visible: true,
        text: "Please wait a few Minutes, Your website is being deployed!",
      });
  
      setTimeout(() => {
        setError({ visible: false, text: "" });
      }, 3000);

      const requestBody = {
        files: files.map(file => ({
          name: file.name,
          content: file.content
        }))
      };

      if (!files || files.length === 0 || !files.some(file => file.content && file.content.trim() !== "")) {
        setError({
          visible: true,
          text: "No valid files to deploy! At least one file must contain content.",
        });
  
        setTimeout(() => {
          setError({ visible: false, text: "" });
        }, 3000);
        return;
      }
  
      const response = await axios.post(`${beUrl}/api/v1/deploy`, requestBody, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
  
      if (response.data.success) {
        setPublishModal({ visible: true, url: response.data.url });
  
        console.log("Website Published at:", response.data.url);
      } else {
        throw new Error(response.data.error || "Failed to deploy site");
      }
    } catch (err) {
      console.error("Error publishing website:", err);
      setError({
        visible: true,
        text: `Failed to publish website. Please try again! ${err}`,
      });
  
      setTimeout(() => {
        setError({ visible: false, text: "" });
      }, 3000);
    }
  };
  
  return <>
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      {/* <NavBar /> */}
      <div className="flex flex-1">
        <ResultSideBar props={fileContent} />
        <div className="flex flex-1 flex-col">
          <ResultNav onCopy={onCopy} onDownload={onDownload} onPublish={onPublish} />
          {!isPreviewing?<WebsitePreview />:
          <div className="flex flex-1">
            <FileExplorer prop={files} setUseState={setSelectedFile}/>
            <CodeEditor file={selectedFile}/>
          </div>
          }
        </div>
      </div>
      <ErrorBlob message={error.text} />
      <PublishModal />
    </div>
  </>
}