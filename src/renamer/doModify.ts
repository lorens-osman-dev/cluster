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
  //remove the parent property if there is one because cluster file should'nt have one
  if (isItem.isFileCluster(plugin, fileItem) === "theCluster") {
    try {
      await plugin.app.fileManager.processFrontMatter(fileItem.file, (frontmatter) => {
        if (!frontmatter) {
          console.error("No frontmatter found in file:", fileItem.file.path);
          return;
        }
        // Update the "parent" property
        const parent = frontmatter?.parent
        if (parent || parent === null || parent instanceof String) {// parent === null means empty
          delete frontmatter.parent
          return
        }
      });
    } catch (error) {
      console.error("Error updating parent frontmatter:", error);

    }
  }
}
async function updateGenerationFrontmatter(plugin: Plugin, fileItem: RenamedItem<TFile>) {
  if (fileItem.file instanceof TFile) {
    try {
      await plugin.app.fileManager.processFrontMatter(fileItem.file, (frontmatter) => {
        if (!frontmatter) {
          console.error("No frontmatter found in file:", fileItem.file.path);
          return;
        }
        // Update the "generation" property
        const generationFromPath = fileItem.oldPath.split('/').length - 2;
        frontmatter.generation = generationFromPath
      });
    } catch (error) {
      console.error("Error updating generation frontmatter:", error);

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
        if (!frontmatter.tags) {
          frontmatter.tags = []
        }

        // remove the "Cluster" itself if there is one because notTheCluster file should'nt have one
        const ClusterTagIndex = (frontmatter.tags as string[]).findIndex(tag => tag.contains("Cluster"));
        if (ClusterTagIndex >= 0) {
          (frontmatter.tags as string[]).splice(ClusterTagIndex, 1)
        }
        // Update the "cluster tag" property  that reference the cluster name
        let tagName = fileItem.newPath.split("/")[1]
        tagName = tagName.endsWith("-cluster") ? tagName : `${tagName}-cluster`
        tagName = tagName.replace(/ /g, "-")
        const clusterTagIndex = (frontmatter.tags as string[]).findIndex(tag => tag.contains("-cluster"));
        if (clusterTagIndex < 0) {
          frontmatter.tags.unshift(tagName)
          return
        }
        if (clusterTagIndex >= 0) {
          (frontmatter.tags as string[]).splice(clusterTagIndex, 1);
          (frontmatter.tags as string[]).unshift(tagName)
          return
        }

      });

    } catch (error) {
      console.error("Error updating -cluster tag frontmatter:", error);
    }
  }
  if (isItem.isFileCluster(plugin, fileItem) === "theCluster") {
    try {
      await plugin.app.fileManager.processFrontMatter(fileItem.file, (frontmatter) => {
        if (!frontmatter) {
          console.error("No frontmatter found in file:", fileItem.file.path);
          return;
        }
        if (!frontmatter.tags) {
          frontmatter.tags = []
        }

        const clusterTagIndex = (frontmatter.tags as string[]).findIndex(tag => tag.contains("Cluster"));
        if (clusterTagIndex < 0) {
          frontmatter.tags.unshift("Cluster")
          return
        }
      });

    } catch (error) {
      console.error("Error updating -cluster tag frontmatter:", error);
    }
  }
}

async function renameLinkedFile(plugin: Plugin, fileItem: RenamedItem<TFolder>): Promise<void> {
  const selfOldName = fileItem.oldPath.split("/").pop();//Removes the last element from an array and returns it.
  const selfNewName = `${fileItem.newPath}.md`
  const siblings = fileItem.file.parent?.children
  const isTherelinkedFile = siblings?.find((item) => item instanceof TFile && item.basename === selfOldName) as TFile;
  if (!isTherelinkedFile) {
    // console.log("Error: No linked file found.");
    return
  }
  try {
    await plugin.app.fileManager.renameFile(isTherelinkedFile, selfNewName);
  } catch (error) {
    console.error("Error renaming linked file:", error);
  }
}
async function renameChildrenFolder(plugin: Plugin, fileItem: RenamedItem<TFile>): Promise<void> {
  const selfOldName = fileItem.oldPath.split("/").find(str => str.endsWith(".md"))?.slice(0, -3)
  const siblings = fileItem.file.parent?.children
  const isThereChildrenFolder = siblings?.find((item) => item instanceof TFolder && item.name === selfOldName) as TFolder
  if (!isThereChildrenFolder) {
    // console.log("Error: No children folder found.");
    return
  }
  try {
    await plugin.app.fileManager.renameFile(isThereChildrenFolder, fileItem.newPath.slice(0, -3));
  } catch (error) {
    console.error("Error renaming children folder:", error);
  }
}
async function forbidClusterRenaming(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>): Promise<boolean> {
  //= files
  if (fileItem.file instanceof TFile && isItem.isFileCluster(plugin, fileItem as RenamedItem<TFile>) === "theCluster") {
    const oldName = fileItem.oldPath.split("/")[1].slice(0, -3)
    const newName = fileItem.newPath.split("/")[1].slice(0, -3)
    if (oldName.endsWith("-cluster") && !(newName.endsWith("-cluster"))) {
      try {
        await plugin.app.fileManager.renameFile(fileItem.file, fileItem.oldPath);
        new Notice("The file name must include the '-cluster' suffix.", 3000)
        return true
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
        return true
      } catch (error) {
        console.error("Error renaming cluster file:", error);
      }
    }
  }
  //= folders
  if (fileItem.file instanceof TFolder && isItem.isFolderCluster(fileItem as RenamedItem<TFolder>) === "theCluster") {
    const oldName = fileItem.oldPath.split("/")[1];
    const newName = fileItem.newPath.split("/")[1];
    if (oldName.endsWith("-cluster") && !(newName.endsWith("-cluster"))) {
      try {
        await plugin.app.fileManager.renameFile(fileItem.file, fileItem.oldPath);
        new Notice("The folder name must include the '-cluster' suffix.", 3000)
        return true
      } catch (error) {
        console.error("Error renaming cluster file:", error);
      }
    }
  }
  if (fileItem.file instanceof TFolder && isItem.isFolderCluster(fileItem as RenamedItem<TFolder>) === "notTheCluster") {
    const newName = fileItem.file.name;
    if (newName.endsWith("-cluster")) {
      try {
        await plugin.app.fileManager.renameFile(fileItem.file, fileItem.oldPath);
        new Notice("You cannot add the '-cluster' suffix to this folder.", 3000)
        return true
      } catch (error) {
        console.error("Error renaming cluster file:", error);
      }
    }
  }
  return false
}
const doModify = {
  file: {
    updateParentFrontmatter,
    updateClusterTagFrontmatter,
    renameChildrenFolder,
    forbidClusterRenaming,
    updateGenerationFrontmatter
  },
  folder: {
    forbidClusterRenaming,
    renameLinkedFile
  }
}

export default doModify