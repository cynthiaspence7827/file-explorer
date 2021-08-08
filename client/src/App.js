import { useState, useEffect } from "react";
import { FileExplorerComponent } from "./components";
import "./App.css";

function App() {
  const [state, setState] = useState({});

  useEffect(() => {
    checkDirectoryFiles(state);
  }, []);

  const checkDirectoryFiles = async (initialState) => {
    let finalState = JSON.parse(JSON.stringify(state));
    if (finalState.children && finalState.children.length) {
      finalState = await fetchFilesAndFolders(
        initialState.dirName || initialState.path
      );
      const children = finalState.children;
      for (let i = 0; i < children.length; i++) {
        if (children.children && children.children.length) {
          children[i].children = await checkDirectoryFiles(children[i]);
        }
      }
    }

    return finalState;
  };

  const fetchFilesAndFolders = async (dirPath) => {
    const res = await fetch(`http://localhost:8000/dir?path=${dirPath}`);
    return await res.json();
  };

  const getSortedByDir = (directories) => {
    directories &&
      directories.length &&
      directories.sort((m1, m2) => {
        if (m1.isDir === null) {
          return -1;
        } else if (m2.isDir === null) {
          return 1;
        }
        if (m1.isDir < m2.isDir) {
          return 1;
        }
        if (m1.isDir > m2.isDir) {
          return -1;
        }
        return 0;
      });
  };

  const onSelectDir = async (selectedItemIndex, item) => {
    console.log({ selectedItemIndex, item: item.path });
    if (item.children && item.children.length) {
      item.children = [];
      setState(JSON.parse(JSON.stringify(state)));
      return;
    }
    const res = await fetchFilesAndFolders(item.path);
    getSortedByDir(res.children);
    item.children = res.children;
    console.log(state);
    setState(JSON.parse(JSON.stringify(state)));
  };

  const onAddressKeyPress = async (e) => {
    if (e.keyCode === 13) {
      const res = await fetchFilesAndFolders(e.target.value);
      getSortedByDir(res.children);
      setState(res);
    }
  };

  return (
    <div>
      <FileExplorerComponent
        state={state}
        onSelectDir={onSelectDir}
        onAddressKeyPress={onAddressKeyPress}
      />
    </div>
  );
}

export default App;
