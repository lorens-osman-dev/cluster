import { TFile, TFolder } from "obsidian"
import { RenamedItem } from "src/types/obsidian"


function isFileHasChildren(fileItem: RenamedItem<TFile>): "alone" | "hasChildren" {
  const selfOldName = fileItem.oldPath.split("/").find(str => str.endsWith(".md"))?.slice(0, -3)
  const siblings = fileItem.file.parent?.children
  const isThereChildrenFolder = siblings?.find((item) => item instanceof TFolder && item.name === selfOldName) as TFolder
  if (isThereChildrenFolder) {
    return "hasChildren"
  }
  return "alone"
}

function isFileCluster(fileItem: RenamedItem<TFile>): "theCluster" | "notTheCluster" | undefined {
  if (fileItem.file instanceof TFolder) {
    return
  }
  if (!(fileItem.file.basename.contains("-cluster"))) {
    return "notTheCluster"
  }
  const fileGeneration = fileItem.newPath.split('/').length - 2;
  if (!(fileGeneration === 0)) {
    return "notTheCluster"
  }
  return "theCluster"
}
function isFolderClusterOrNormal(fileItem: RenamedItem<TFolder>): "theCluster" | "notTheCluster" {
  if (!(fileItem.file.name.contains("-cluster"))) {
    return "notTheCluster"
  }
  const fileGeneration = fileItem.newPath.split('/').length - 2;
  if (!(fileGeneration === 0)) {
    return "notTheCluster"
  }
  return "theCluster"
}
function whatClusteringState(fileItem: RenamedItem<TFolder>): "linked" | "unLinked" {
  const selfName = fileItem.file.name
  const siblings = fileItem.file.parent?.children
  const mainNoteOfFolder = siblings?.find((item) => item instanceof TFile && item.basename === selfName) as TFile
  if (mainNoteOfFolder) {
    return "linked"
  }
  return "unLinked"
}


const isItem = {
  isFileHasChildren,
  isFileCluster,
  isFolderClusterOrNormal,
  whatClusteringState
}

export default isItem