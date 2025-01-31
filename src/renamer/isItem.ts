import { Plugin, TFile, TFolder } from "obsidian"
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
  const frontmatter = plugin.app.metadataCache.getFileCache(fileItem.file)?.frontmatter;
  const theClusterTag = (frontmatter?.tags as string[]).find(tag => tag === "Cluster");
  const clusterTag = (frontmatter?.tags as string[]).find(tag => tag.contains("-cluster"));
  const oldName = fileItem.oldPath.split("/")[1].slice(0, -3);
  const newName = fileItem.newPath.split("/")[1].slice(0, -3);
  const fileGeneration = fileItem.newPath.split('/').length - 2;
  const result = U.IF([
    [fileItem.file instanceof TFile, "its is folder"],
    [oldName.endsWith("-cluster"), "old name didn't end with cluster"],
    [fileGeneration === 0, "cluster generation must be 0 "],
    [theClusterTag === "Cluster", "there is no Cluster tag"],
    [!clusterTag, "there parent cluster"],
  ])
  if (result === true) {
    return "theCluster"
  } else {
    return "notTheCluster"
  }

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