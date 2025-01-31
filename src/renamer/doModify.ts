import { TFile, TFolder, Plugin, TAbstractFile } from 'obsidian';
import { RenamedItem } from "src/types/obsidian";

async function updateParentFrontmatter(plugin: Plugin, fileItem: RenamedItem<TFile>) {
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
async function updateClusterTagFrontmatter(plugin: Plugin, fileItem: RenamedItem<TFile>) {
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
const doModify = {
  file: {
    updateParentFrontmatter,
    updateClusterTagFrontmatter,
    renameChildrenFolder
  },
  folder: {

  }
}

export default doModify