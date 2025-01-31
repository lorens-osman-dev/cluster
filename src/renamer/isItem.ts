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
  const theClusterTag = (frontmatter?.tags as string[])?.find(tag => tag === "Cluster");
  const clusterTag = (frontmatter?.tags as string[])?.find(tag => tag.contains("-cluster"));
  const generationFromFrontmatter = frontmatter?.generation
  const generationFromPath = fileItem.oldPath.split('/').length - 2;
  const parent = frontmatter?.parent
  const oldName = fileItem.oldPath.split("/")[1].slice(0, -3);
  const newName = fileItem.newPath.split("/")[1].slice(0, -3);
  const theClusterResult = U.IF([
    [fileItem.file instanceof TFile, "its is folder"],
    [oldName.endsWith("-cluster"), "old name didn't ends with -cluster"],
    [generationFromFrontmatter === 0, "cluster generation must be 0 "],
    [generationFromPath === 0, "cluster generation must be 0 "],
    [generationFromPath === generationFromFrontmatter, "generationFromFrontmatter must equal generationFromPath "],
    [theClusterTag === "Cluster", "there is no Cluster tag"],
    [!clusterTag, `${clusterTag} forbidden`],
    [!parent, `the parent property ${parent} forbidden`],
  ])
  if (theClusterResult === true) {
    return "theCluster"
  }
  const notTheClusterResult = U.IF([
    [fileItem.file instanceof TFile, "its is folder"],
    [!(oldName.endsWith("-cluster")), "old name ends with -cluster"],
    [!(generationFromFrontmatter === 0), "generation must be bigger than 0 "],
    [!(generationFromPath === 0), "generation must be bigger than 0 "],
    [generationFromPath === generationFromFrontmatter, "generationFromFrontmatter must equal generationFromPath "],
    [!(theClusterTag === "Cluster"), "Cluster tag forbidden"],
    [typeof clusterTag === 'string' && clusterTag.contains("-cluster"), `${clusterTag} is missing`],
    [parent, `the parent property ${parent} forbidden`],
  ])
  if (notTheClusterResult === true) {
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