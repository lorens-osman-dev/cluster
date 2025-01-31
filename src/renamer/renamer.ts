import { TFile, TFolder, Plugin, TAbstractFile } from 'obsidian';
import { RenamedFileItemType, RenamedItem } from '../types/obsidian';
import { checkRenamedFileItemType } from './checkRenamedFileItemType';
import doModify from './doModify';

export async function renamer(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>) {

  const renamedFileItemType = checkRenamedFileItemType(fileItem)
  console.log(fileItem.file.name + "-->", renamedFileItemType);
  if (!renamedFileItemType) {
    console.log("renamedFileItemType:", renamedFileItemType);
    return
  }
  //do rename
  rename(plugin, fileItem, renamedFileItemType)
}



export async function rename(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>, type: RenamedFileItemType) {
  // file:alone:notTheCluster
  if (type === "file:alone:notTheCluster") {
    doModify.file.updateClusterTagFrontmatter(plugin, fileItem as RenamedItem<TFile>)
    doModify.file.updateParentFrontmatter(plugin, fileItem as RenamedItem<TFile>)
  }
  // file:alone:theCluster //! forbid naming -cluster for non cluster

  // file:hasChildren:notTheCluster
  if (type === "file:hasChildren:notTheCluster") {
    doModify.file.updateClusterTagFrontmatter(plugin, fileItem as RenamedItem<TFile>)
    doModify.file.updateParentFrontmatter(plugin, fileItem as RenamedItem<TFile>)
    doModify.file.renameChildrenFolder(plugin, fileItem as RenamedItem<TFile>)
  }

}


