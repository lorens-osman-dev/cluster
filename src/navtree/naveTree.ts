import { TFile, TFolder, Plugin } from 'obsidian';
import { ExplorerLeaf, ElementsObj, Pairs } from '../types/obsidian';

export function newNavTreeStart(plugin: Plugin) {

  // 1.get the elements in CLUSTER 
  const elements = getElementsObj(plugin)
  if (!elements) {
    return
  }
  // 1.extract/sort the pairs from elements
  const pairs = getPairs(elements)
  if (!pairs) {
    return
  }
  // 3.edit the old navTree
  oldNavTreeChange(plugin, pairs)
}
export function dealWithOldToMove() {

}
export function oldNavTreeChange(plugin: Plugin, pairs: Pairs) {
  pairs.forEach((pair) => {
    const targetInnerEl = pair.folder.innerEl;
    const targetCon = pair.folder.selfEl;
    const toMoveCon = pair.file.selfEl;
    const toMove = pair.file.innerEl;
    // console.log("toMove:", toMove, targetCon)
    const dataPath = pair.file.file.path;

    toMove.addClass("toMove");
    targetCon.addClass("targetCon");
    toMoveGenerationClassAdd(toMove, dataPath)

    toMove.setAttribute("data-path", dataPath);
    toMove.addEventListener("click", (e) => {
      e.stopPropagation();
      const file = plugin.app.vault.getAbstractFileByPath(dataPath as string);
      if (file instanceof TFile) {
        plugin.app.workspace.getLeaf().openFile(file);
      }
    });

    targetInnerEl.style.display = "none"
    toMoveCon.style.display = "none"
    targetCon.appendChild(toMove)

  })
}
export function toMoveGenerationClassAdd(el: HTMLElement, path: string) {
  const gen = path.split('/').length - 2;
  if (gen < 0) {
    return
  }
  el.addClass(`g${gen}`);
}
export function getPairs(elements: ElementsObj): Pairs | undefined {
  const pairs: Pairs = [];
  elements.folders.forEach((folder) => {
    if (folder.file.path === "CLUSTERS") {
      return;
    }
    folder.file.parent?.children.forEach((child) => {
      if (child instanceof TFile && child.basename === folder.file.name) {
        const file = elements.files.find(item => item.file.name === child.name);
        if (file) {
          pairs.push({ file: file, folder: folder });
        }
      }
    });
  });

  // elements.oldToMoveElements.forEach((item) => {
  //   console.log("item name:", item.file.name.slice(0, -3))
  //   const isHasFolderToPair = elements.folders.find((folder) => folder.file.name === item.file.name.slice(0, -3))
  //   if (isHasFolderToPair) {
  //     console.log("pair:", item)
  //     return
  //   }
  //   console.log(isHasFolderToPair, "single:", item)
  //   item.selfEl.style.display = "block"
  // })
  // console.log(elements)
  return pairs.length > 0 ? pairs : undefined;
}



// Get Elements object from CLUSTERS folder
export function getElementsObj(plugin: Plugin): ElementsObj | undefined {
  const fileExplorers = plugin.app.workspace.getLeavesOfType('file-explorer');
  const elementsObj: ElementsObj = {
    files: [],
    folders: [],
    oldToMoveElements: []
  };

  fileExplorers.forEach((fileExplorer: ExplorerLeaf) => {
    const newTree = fileExplorer.view.fileItems;
    for (const key in newTree) {
      if (newTree.hasOwnProperty(key)) {
        const el = newTree[key];
        if (el.file instanceof TFile && el.file.path.startsWith("CLUSTERS")) {
          if (el.innerEl.classList.contains("toMove")) {
            elementsObj.oldToMoveElements.push(el);
          }
          elementsObj.files.push(el);
        } else if (el.file instanceof TFolder && el.file.path.startsWith("CLUSTERS")) {
          elementsObj.folders.push(el);
        }
      }
    }
  });

  return elementsObj.folders.length > 0 ? elementsObj : undefined;
}
