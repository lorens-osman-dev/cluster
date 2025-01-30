import { TAbstractFile, TFile, TFolder } from "obsidian"
import { RenamedItem } from "src/types/obsidian"
import U from "src/util/U"

function isFileHasChildren(fileItem: RenamedItem<TFile>): Boolean {
  if (!fileItem) {
    U.createErrorMessage("isFileHasChildren function", "invalid file item")
  }
  const selfOldName = fileItem.oldPath.split("/").find(str => str.endsWith(".md"))?.slice(0, -3)
  const siblings = fileItem.file.parent?.children
  const isThereChildrenFolder = siblings?.find((item) => item instanceof TFolder && item.name === selfOldName) as TFolder
  if (isThereChildrenFolder) {
    return true
  }
  return false
}

function isFileOrFolder(fileItem: RenamedItem<TAbstractFile>): "file" | "folder" {
  if (!fileItem) {
    U.createErrorMessage("isFileOrFolder function", "invalid file item")
  }
  if (fileItem.file instanceof TFile) {
    return "file"
  }
  return "folder"
}


const isItem = {
  isFileOrFolder,
  isFileHasChildren,
  isFileHasChildren,
  isFileCluster,
  isFolderClusterOrNormal
  whatClusteringState
}