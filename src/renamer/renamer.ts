import { TFile, TFolder, Plugin, TAbstractFile } from 'obsidian';
import { RenamedItem } from '../types/obsidian';
import isItem from './isItem';
import { checkRenamedFileItemType } from './checkRenamedFileItemType';
import U from 'src/util/U';

export async function renamer(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>) {
  if (fileItem.file instanceof TFolder) {

    const t = checkRenamedFileItemType(fileItem)
    console.log(`${fileItem.file.name} folder `, t)
  }

  // const check1 = U.IF([
  //   [fileItem.file instanceof TFile, "the file is folder"],
  //   [isItem.isFileHasChildren(fileItem as RenamedItem<TFile>) === "alone", "the file has children"],
  //   [isItem.isFileCluster(fileItem as RenamedItem<TFile>) === "notTheCluster", "the file is cluster"],
  // ])
  // if (check1 === true) {
  //   console.log(fileItem.file.name + ":", check1);
  //   return 'file:hasChildren:notTheCluster';
  // } else {

  //   console.log(fileItem.file.name + "else:\n", check1);
  // }

}



export async function rename(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>) {
  //_ if the file is cluster
  //_ forbid naming -cluster for non cluster
  if (fileItem.file instanceof TFile) {
    const isThereChildrenFolder = getFileHasChildrenFolder(fileItem as RenamedItem<TFile>)
    if (isThereChildrenFolder) {
      await editAloneFile(plugin, fileItem as RenamedItem<TFile>)
      await plugin.app.fileManager.renameFile(isThereChildrenFolder, fileItem.newPath.slice(0, -3))
      return
    }
    await editAloneFile(plugin, fileItem as RenamedItem<TFile>)
    return
  }

  //_   if (fileItem.file instanceof TFolder)   
}

function getFileHasChildrenFolder(fileItem: RenamedItem<TFile>): TFolder | false {
  const selfOldName = fileItem.oldPath.split("/").find(str => str.endsWith(".md"))?.slice(0, -3)
  const siblings = fileItem.file.parent?.children
  const isThereChildrenFolder = siblings?.find((item) => item instanceof TFolder && item.name === selfOldName) as TFolder
  if (isThereChildrenFolder) {
    return isThereChildrenFolder
  }
  return false
}

export async function editAloneFile(plugin: Plugin, fileItem: RenamedItem<TFile>) {
  try {
    await plugin.app.fileManager.processFrontMatter(fileItem.file, (frontmatter) => {
      if (!frontmatter) {
        console.error("No frontmatter found in file:", fileItem.file.path);
        return;
      }
      console.log("frontmatter.paren:", frontmatter.parent)
      // Update the "parent" property
      frontmatter.parent = `[[${fileItem.file.parent?.path}|${fileItem.file.parent?.name}]]`;

      // Update the "cluster tag" property
      const clusterTagIndex = (frontmatter.tags as string[]).findIndex(tag => tag.contains("-cluster"));
      (frontmatter.tags as string[])[clusterTagIndex] = fileItem.newPath.split("/")[1]
    });

  } catch (error) {
    console.error("Error updating frontmatter:", error);
  }
}