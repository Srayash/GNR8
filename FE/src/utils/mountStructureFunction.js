export default function createMountStructure(files) {
    const mountStructure = {};

    files.forEach((file) => {
      if (file.type === 'file') {
        mountStructure[file.name] = {
          file: {
            contents: file.content || '',
          },
        };
      } else if (file.type === 'folder') {
        mountStructure[file.name] = {
          directory: file.children ? createMountStructure(file.children) : {},
        };
      }
    });

    return mountStructure;
  }