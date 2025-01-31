export default function transformToFileStructure(content) {
    const result = [];

    result.push({
      name: 'index.html',
      type: 'file',
      path: '/index.html',
      content: content.html.code,
    });

    result.push({
      name: 'styles.css',
      type: 'file',
      path: '/styles.css',
      content: content.css.code,
    });

    result.push({
      name: 'script.js',
      type: 'file',
      path: '/script.js',
      content: content.js.code,
    });

    return result;
  }