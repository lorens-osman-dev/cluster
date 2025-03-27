import { Notice, Plugin, TAbstractFile, TFile, TFolder } from "obsidian"
import { RenamedItem } from "src/types/obsidian"
import U from "src/util/U"


function isFileHasChildren(fileItem: RenamedItem<TFile>): "alone" | "hasChildren" {
  const selfOldName = fileItem.oldPath.split("/").find(str => str.endsWith(".md"))?.slice(0, -3)
  const siblings = fileItem.file.parent?.children
  const isThereChildrenFolder = siblings?.find((item) => item instanceof TFolder && item.name === selfOldName) as TFolder
  if (isThereChildrenFolder) {
    return "hasChildren"
  }
  return "alone"
}

function isFileCluster(plugin: Plugin, fileItem: RenamedItem<TFile>): "theCluster" | "notTheCluster" | undefined {
  if (fileItem.file instanceof TFolder) {
    return
  }

  const generationFromPath = fileItem.oldPath.split('/').length - 2;
  const oldName = fileItem.oldPath.split("/")[1].slice(0, -3);
  const theClusterResult = U.IF([
    [fileItem.file instanceof TFile, "its is folder"],
    [oldName.endsWith("-cluster"), "old name didn't ends with -cluster"],
    [generationFromPath === 0, "cluster generation must be 0 "],
  ])
  if (theClusterResult === true) {
    return "theCluster"
  }
  const notTheClusterResult = U.IF([
    [fileItem.file instanceof TFile, "its is folder"],
    [!(oldName.endsWith("-cluster")), "old name ends with -cluster"],
    [!(generationFromPath === 0), "generation must be bigger than 0 "],
  ])
  if (notTheClusterResult === true) {
    return "notTheCluster"
  }

}
function isFolderCluster(fileItem: RenamedItem<TFolder>): "theCluster" | "notTheCluster" | undefined {
  if (fileItem.file instanceof TFile) {
    return
  }

  const generationFromPath = fileItem.oldPath.split('/').length - 2;
  const oldName = fileItem.oldPath.split("/")[1];
  const theClusterResult = U.IF([
    [fileItem.file instanceof TFolder, "its is file"],
    [oldName.endsWith("-cluster"), "old name didn't ends with -cluster"],
    [generationFromPath === 0, "cluster generation must be 0 "],
  ])
  if (theClusterResult === true) {
    return "theCluster"
  }
  const notTheClusterResult = U.IF([
    [fileItem.file instanceof TFolder, "its is file"],
    [(oldName.endsWith("-cluster")), "old name ends with -cluster"],
    [!(generationFromPath === 0), "generation must be bigger than 0 "],
  ])
  if (notTheClusterResult === true) {
    return "notTheCluster"
  }
}
function whatClusteringState(fileItem: RenamedItem<TFolder>): "linked" | "unLinked" {
  const selfName = fileItem.file.name
  const siblings = fileItem.file.parent?.children
  const isTherelinkedFile = siblings?.find((item) => item instanceof TFile && item.basename === selfName) as TFile
  if (isTherelinkedFile) {
    return "linked"
  }
  return "unLinked"
}

async function isCLUSTERSorORPHANS(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>): Promise<boolean> {
  if (fileItem.file instanceof TFolder && fileItem.oldPath === "CLUSTERS") {
    if (fileItem.newPath !== "CLUSTERS") {
      try {
        await plugin.app.fileManager.renameFile(fileItem.file, "CLUSTERS");
        new Notice("This folder should remains with CLUSTERS name", 3000)
        return true
      } catch (error) {
        console.error("Error renaming cluster file:", error);
      }
    }
  }
  if (fileItem.file instanceof TFolder && fileItem.oldPath === "ORPHANS") {
    if (fileItem.newPath !== "ORPHANS") {
      try {
        await plugin.app.fileManager.renameFile(fileItem.file, "ORPHANS");
        new Notice("This folder should remains with ORPHANS name", 3000)
        return true
      } catch (error) {
        console.error("Error renaming cluster file:", error);
      }
    }
  }
  return false
}

const isItem = {
  isFileHasChildren,
  isFileCluster,
  isFolderCluster,
  whatClusteringState,
  isCLUSTERSorORPHANS
}

export default isItem