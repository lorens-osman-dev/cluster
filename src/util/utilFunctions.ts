// createDirectory.ts
import { App, Platform, normalizePath ,TFolder, Vault, MarkdownView,TFile} from 'obsidian';
import { path } from './utils';

const CLUSTERS = "CLUSTERS";
const HN = "HYPER-NODES"

//#region ---------------------[[ createDirectory ]]---------------------\\
export async function createDirectory(dir: string, folder: any): Promise<void> {

  const { vault } = app;
  const { adapter } = vault;
  const root = vault.getRoot().path;
  const directoryPath = path.join(folder.path, dir);
  const directoryExists = await adapter.exists(directoryPath);

  if (!Platform.isIosApp) {
    if (!directoryExists) {
      return adapter.mkdir(normalizePath(directoryPath));
    }
  }

  const subPaths: string[] = normalizePath(directoryPath)
    .split('/')
    .filter((part) => part.trim() !== '')
    .map((_, index, arr) => arr.slice(0, index + 1).join('/'));

  for (const subPath of subPaths) {
    const directoryExists = await adapter.exists(path.join(root, subPath));
    if (!directoryExists) {
      await adapter.mkdir(path.join(root, subPath));
    }
  }
}
//#endregion

//#region ---------------------[[ createClustersFolder ]]---------------------\\
export async function createClustersFolder(): Promise<void>  {

  // Create clusters folder
  const clusterFolder = await getFoldersFunction().sortedFolders.find((item :any) => {
    if (item.path == CLUSTERS) {
      return true;
    }
  });
  if (!clusterFolder) {
    await createDirectory(`${CLUSTERS}/`,getFoldersFunction().rootFolder);
  }
}
//#endregion

//#region ---------------------[[ getFoldersFunction  ]]---------------------\\
export  function getFoldersFunction(): any {
  const foldersListObj = {
    folders: new Set() as Set<TFolder>,
    sortedFolders: [] as TFolder[],
    rootFolder: {} as any,
    clustersFolder: {} as any,
    importantFolders: new Set as any,
    newOptions: undefined as any,
  };

  //#region get folders list 
  let leaf = this.app.workspace.getLeaf(false);
  if (
    leaf &&
    leaf.view instanceof MarkdownView &&
    leaf.view.file instanceof TFile &&
    leaf.view.file.parent instanceof TFolder
  ) {
    // pre-select current folder
    const item = leaf.view.file.parent;
    if (item.path == CLUSTERS || item.path == HN) {
      foldersListObj.importantFolders.add(item);
    } else if (item.path.startsWith(`${CLUSTERS}/`) || item.path.startsWith(`${HN}/`)) {
      foldersListObj.importantFolders.add(item);
    } else {
      foldersListObj.folders.add(leaf.view.file.parent);
      foldersListObj.sortedFolders.push(leaf.view.file.parent);
    }
  }
  Vault.recurseChildren(this.app.vault.getRoot(), (file) => {
    if (file instanceof TFolder && !foldersListObj.folders.has(file)) {
      if (file.path == CLUSTERS || file.path == HN) {
        foldersListObj.importantFolders.add(file);
      } else if (file.path.startsWith(`${CLUSTERS}/`) || file.path.startsWith(`${HN}/`)) {
        foldersListObj.importantFolders.add(file);
      } else {
        foldersListObj.folders.add(file);
        foldersListObj.sortedFolders.push(file);
      }
    }
  });
  //#endregion

  // set ROOT Folder value
  if (Object.keys(foldersListObj.rootFolder).length === 0) {

    foldersListObj.rootFolder = foldersListObj.sortedFolders.find(item => item.path == '/')
    foldersListObj.rootFolder.id = 0
  }

  // set  cluster folder
  foldersListObj.clustersFolder = [...foldersListObj.importantFolders].find(item => item.path == `${CLUSTERS}`)



  //#region Set newOption Function
  foldersListObj.newOptions = (optionsParameter: any) => {
    const options = optionsParameter.map((item: string, index: number) => {
      return { id: index, path: item}
    })
    // Make copy of the ROOT folder at the first
    foldersListObj.sortedFolders.splice(0, 0, foldersListObj.rootFolder)
    // Delete the other copy of the ROOT folder
    foldersListObj.sortedFolders.forEach((item, index) => {
      if (!(index == 0) && item.path == "/") {
        foldersListObj.sortedFolders.splice(index, 1)
      }
    })
    // Add new options to top of sortedFolders array and after ROOT folder
    foldersListObj.sortedFolders.splice(1, 0, ...options)

    return foldersListObj.sortedFolders
  };
  //#endregion

  return foldersListObj
}
//#endregion
