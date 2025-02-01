import { TFile, TFolder, Plugin, Notice, TAbstractFile } from 'obsidian';
import { RenamedItem } from "src/types/obsidian";
import isItem from './isItem';

async function updateParentFrontmatter(plugin: Plugin, fileItem: RenamedItem<TFile>) {
  if (isItem.isFileCluster(plugin, fileItem) === "notTheCluster") {
    try {
      await plugin.app.fileManager.processFrontMatter(fileItem.file, (frontmatter) => {
        if (!frontmatter) {
          console.error("No frontmatter found in file:", fileItem.file.path);
          return;
        }
        // Update the "parent" property
        frontmatter.parent = `[[${fileItem.file.parent?.path}|${fileItem.file.parent?.name}]]`;
      });
    } catch (error) {
      console.error("Error updating parent frontmatter:", error);

    }
  }
}
async function updateClusterTagFrontmatter(plugin: Plugin, fileItem: RenamedItem<TFile>) {
  if (isItem.isFileCluster(plugin, fileItem) === "notTheCluster") {
    try {
      await plugin.app.fileManager.processFrontMatter(fileItem.file, (frontmatter) => {
        if (!frontmatter) {
          console.error("No frontmatter found in file:", fileItem.file.path);
          return;
        }
        // Update the "cluster tag" property
        const clusterTagIndex = (frontmatter.tags as string[]).findIndex(tag => tag.contains("-cluster"));
        (frontmatter.tags as string[])[clusterTagIndex] = fileItem.newPath.split("/")[1]
      });

    } catch (error) {
      console.error("Error updating cluster tag frontmatter:", error);
    }
  }
}

async function renameChildrenFolder(plugin: Plugin, fileItem: RenamedItem<TFile>): Promise<void> {
  const selfOldName = fileItem.oldPath.split("/").find(str => str.endsWith(".md"))?.slice(0, -3)
  const siblings = fileItem.file.parent?.children
  const isThereChildrenFolder = siblings?.find((item) => item instanceof TFolder && item.name === selfOldName) as TFolder
  if (!isThereChildrenFolder) {
    console.log("Error: No children folder found.");
    return
  }
  try {
    await plugin.app.fileManager.renameFile(isThereChildrenFolder, fileItem.newPath.slice(0, -3));
  } catch (error) {
    console.error("Error renaming children folder:", error);
  }
}
async function forbidClusterRenaming(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>): Promise<void> {
  if (fileItem.file instanceof TFile && isItem.isFileCluster(plugin, fileItem as RenamedItem<TFile>) === "theCluster") {
    const oldName = fileItem.oldPath.split("/")[1].slice(0, -3)
    const newName = fileItem.newPath.split("/")[1].slice(0, -3)
    if (oldName.endsWith("-cluster") && !(newName.endsWith("-cluster"))) {
      try {
        await plugin.app.fileManager.renameFile(fileItem.file, fileItem.oldPath);
        new Notice("The file name must include the '-cluster' suffix.", 3000)
      } catch (error) {
        console.error("Error renaming cluster file:", error);
      }
    }
  }
  if (fileItem.file instanceof TFile && isItem.isFileCluster(plugin, fileItem as RenamedItem<TFile>) === "notTheCluster") {
    const newName = fileItem.file.basename
    if (newName.endsWith("-cluster")) {
      try {
        await plugin.app.fileManager.renameFile(fileItem.file, fileItem.oldPath);
        new Notice("You cannot add the '-cluster' suffix to this file.", 3000)
      } catch (error) {
        console.error("Error renaming cluster file:", error);
      }
    }
  }
  if (fileItem.file instanceof TFolder && isItem.isFolderCluster(fileItem as RenamedItem<TFolder>) === "theCluster") {
    const oldName = fileItem.oldPath.split("/")[1];
    const newName = fileItem.newPath.split("/")[1];
    if (oldName.endsWith("-cluster") && !(newName.endsWith("-cluster"))) {
      try {
        await plugin.app.fileManager.renameFile(fileItem.file, fileItem.oldPath);
        new Notice("The folder name must include the '-cluster' suffix.", 3000)
      } catch (error) {
        console.error("Error renaming cluster file:", error);
      }
    }
  }
}
const doModify = {
  file: {
    updateParentFrontmatter,
    updateClusterTagFrontmatter,
    renameChildrenFolder,
    forbidClusterRenaming
  },
  folder: {

  }
}

export default doModify