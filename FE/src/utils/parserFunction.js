  export default function parseContent(pastedContent) {
    const result = {
      html: { filePath: '', code: '' },
      css: { filePath: '', code: '' },
      js: { filePath: '', code: '' },
      brief: { message: '' },
    };

    const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
    const briefRegex = /This code creates[\s\S]*?\.$/m;

    let matches;
    while ((matches = codeBlockRegex.exec(pastedContent)) !== null) {
      const language = matches[1].toLowerCase();
      const code = matches[2];

      switch (language) {
        case 'html':
          result.html.filePath = 'index.html';
          result.html.code = code.replace(/<!-- index\.html -->\n/, '');
          break;

        case 'css':
          result.css.filePath = 'styles.css';
          result.css.code = code.replace(/\/\* styles\.css \*\/\n/, '');
          break;

        case 'javascript':
          result.js.filePath = 'script.js';
          result.js.code = code;
          break;

        default:
          break;
      }
    }

    const briefMatch = briefRegex.exec(pastedContent);
    if (briefMatch) {
      result.brief.message = briefMatch[0].trim();
    }

    const replaceNewlines = (str) => str.replace(/\\n/g, '\n');

    return {
      html: {
        filePath: result.html.filePath,
        code: replaceNewlines(result.html.code.trim()),
      },
      css: {
        filePath: result.css.filePath,
        code: replaceNewlines(result.css.code.trim()),
      },
      js: {
        filePath: result.js.filePath,
        code: replaceNewlines(result.js.code.trim()),
      },
      brief: {
        message: '\n' + result.brief.message,
      },
    };
  }