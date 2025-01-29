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
  const file = fileItem.file;
  try {
    await plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
      console.log("Original frontmatter:", frontmatter);

      // Ensure frontmatter is an object before modifying it
      if (!frontmatter) {
        console.error("No frontmatter found in file:", file.path);
        return;
      }
      // Update the "parent" property
      frontmatter.parent = `[[${file.parent?.path}|${file.parent?.name}]]`;
    });

  } catch (error) {
    console.error("Error updating frontmatter:", error);
  }
}