import { TAbstractFile, TFile, TFolder } from "obsidian"
import { RenamedItem } from "src/types/obsidian"


function isFileHasChildren(fileItem: RenamedItem<TFile>): Boolean {
  const selfOldName = fileItem.oldPath.split("/").find(str => str.endsWith(".md"))?.slice(0, -3)
  const siblings = fileItem.file.parent?.children
  const isThereChildrenFolder = siblings?.find((item) => item instanceof TFolder && item.name === selfOldName) as TFolder
  if (isThereChildrenFolder) {
    return true
  }
  return false
}

function isFileOrFolder(fileItem: RenamedItem<TAbstractFile>): "file" | "folder" {
  if (fileItem.file instanceof TFile) {
    return "file"
  }
  return "folder"
}
function isFileCluster(fileItem: RenamedItem<TFile>): "theCluster" | "notTheCluster" {
  if (!(fileItem.file.basename.contains("-cluster"))) {
    return "notTheCluster"
  }
  const fileGeneration = fileItem.newPath.split('/').length - 2;
  if (!(fileGeneration === 0)) {
    return "notTheCluster"
  }
  return "theCluster"
}
function isFolderClusterOrNormal(fileItem: RenamedItem<TFolder>): "normal" | "cluster" {
  if (!(fileItem.file.name.contains("-cluster"))) {
    return "normal"
  }
  const fileGeneration = fileItem.newPath.split('/').length - 2;
  if (!(fileGeneration === 0)) {
    return "normal"
  }
  return "cluster"
}


const isItem = {
  isFileOrFolder,
  isFileHasChildren,
  isFileCluster,
  isFolderClusterOrNormal
  whatClusteringState
}