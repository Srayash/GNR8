import { useEffect, useState } from 'react';
import parseContent from '../utils/parserFunction';
import { useRecoilValue } from 'recoil';
import { predictionStateAtom } from '../store/atoms/predictionState';

export default function WebsitePreview() {
  const prediction = useRecoilValue(predictionStateAtom);
  const fileContent = parseContent(prediction);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!fileContent) return;

    const cssCode = fileContent?.css?.code || '';
    const htmlCode = fileContent?.html?.code || '';
    const jsCode = fileContent?.js?.code || '';

    const htmlBlob = new Blob(
      [
        `<!DOCTYPE html>
         <html>
           <head>
             <meta charset="UTF-8"/>
             <style>${cssCode}</style>
           </head>
           <body>
             ${htmlCode}
             <script>${jsCode}</script>
           </body>
         </html>`
      ],
      { type: 'text/html' }
    );

    const url = URL.createObjectURL(htmlBlob);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [prediction]);

  return (
    <div className="h-full w-full">
      {previewUrl ? (
        <iframe
          src={previewUrl}
          width="100%"
          height="100%"
          className="border-none"
          title="Preview"
        />
      ) : (
        <div className="h-full flex items-center justify-center text-red-500">
          Unable to generate preview
        </div>
      )}
    </div>
  );
}
