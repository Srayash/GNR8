import MonacoEditor from '@monaco-editor/react';

/**
 * Displays the code of the currently selected file in a Monaco Editor.
 * @param {{ file: { name: string, content: string }}} props
 */
export default function CodeEditor({ file }) {
  if(!file){
    return(<div className='h-full w-full bg-black'></div>)
  }

  const { name, content } = file;

  let language = 'plaintext';
  if (name.endsWith('.html')) language = 'html';
  else if (name.endsWith('.css')) language = 'css';
  else if (name.endsWith('.js')) language = 'javascript';

  return (
    <MonacoEditor
      className="flex-1 z-20"
      height="100%"
      language={language}
      value={content}
      theme="vs-dark"
      options={{
        selectOnLineNumbers: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        wordWrap: 'on',
      }}
    />
  );
}
