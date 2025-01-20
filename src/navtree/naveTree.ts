import { TFile, TFolder } from 'obsidian';
import { ExplorerLeaf, ElementsObj, Pairs } from '../types/obsidian';

export function sayHi() {

  const elements = getElementsObj()
  if (!elements) {
    return
  }
  const pairs = getPairs(elements)
  if (!pairs) {
    return
  }
  newFileTree(pairs)
}

export function newFileTree(pairs: Pairs) {
  pairs.forEach((pair) => {
    const targetInnerEl = pair.folder.innerEl
    const targetCon = pair.folder.selfEl
    const toMoveCon = pair.file.selfEl
    const toMove = pair.file.innerEl

    const dataPath = toMoveCon.getAttribute('data-path');

    toMove.setAttribute("data-path", dataPath as string)
    toMove.addEventListener('click', () => {
      const file = this.app.vault.getAbstractFileByPath(dataPath as string);
      if (file instanceof TFile) {
        this.app.workspace.getLeaf().openFile(file);
      }
    });

    targetInnerEl.style.display = "none"
    toMoveCon.style.display = "none"
    targetCon.appendChild(toMove)

    console.log(dataPath)

  })
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
  return pairs.length > 0 ? pairs : undefined;
}



// Get Elements object from CLUSTERS folder
export function getElementsObj(): ElementsObj | undefined {
  const fileExplorers = this.app.workspace.getLeavesOfType('file-explorer');
  const elementsObj: ElementsObj = {
    files: [],
    folders: []
  };

  fileExplorers.forEach((fileExplorer: ExplorerLeaf) => {
    const newTree = fileExplorer.view.fileItems;
    for (const key in newTree) {
      if (newTree.hasOwnProperty(key)) {
        const el = newTree[key];
        if (el.file instanceof TFile && el.file.path.startsWith("CLUSTERS")) {
          elementsObj.files.push(el);
        } else if (el.file instanceof TFolder && el.file.path.startsWith("CLUSTERS")) {
          elementsObj.folders.push(el);
        }
      }
    }
  });

  return elementsObj.folders.length > 0 ? elementsObj : undefined;
}
// export function sayHi(){

//    // Access an HTML element by its class, ID, or tag name
//    const childElement = document.querySelector('[data-path="CLUSTERS"]') as HTMLElement;
//    const parentElement = childElement.closest('.tree-item.nav-folder') as HTMLElement;
//    if (!parentElement) {
//      console.log('Element not found')
//      return;
//     }
//     console.log('Element found:', parentElement.childNodes);
//     console.log(getNameText(parentElement.childNodes[0]))
// }

function getNameText(element: ChildNode): string | false {

  if (!(element as HTMLElement).classList.contains("tree-item-self")) {
    return false;
  }
  const realElement = Array.from(element.childNodes).find((child: ChildNode) => {
    if ((child as HTMLElement).classList.contains("tree-item-inner")) {
      return true;
    }
    return false;
  }) as HTMLElement;
  if (!realElement) return false
  const elementName: string = realElement.innerText
  return elementName
}