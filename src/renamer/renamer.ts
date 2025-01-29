import { TFile, TFolder, Plugin, TAbstractFile } from 'obsidian';
import { ExplorerLeaf, ElementsObj, RenamedItem } from '../types/obsidian';

export function renamer(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>) {

  // 1.get the elements in CLUSTER 
  const result = checkFileItemType(plugin, fileItem)
  // if (!elements) {
  //   return
  // }

}

// Get Elements object from CLUSTERS folder
export function checkFileItemType(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>) {
  // console.log("fileItem:", fileItem.file.parent?.name);

  if (fileItem.file instanceof TFile) {
    const isThereChildrenFolder = checkFileChildrenFolder(fileItem as RenamedItem<TFile>)
    if (!isThereChildrenFolder) {
      console.log("Alone file:", !isThereChildrenFolder);
      editAloneFile(plugin, fileItem as RenamedItem<TFile>)
      return
    }
    console.log("isThereChildrenFolder:", isThereChildrenFolder);
  }
  // if(fileItem.file instanceof TFile && fileItem.file.parent?.name)
}

export function checkFileChildrenFolder(fileItem: RenamedItem<TFile>): TFolder | false {
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