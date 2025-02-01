import { TFile, TFolder, Plugin, TAbstractFile } from 'obsidian';
import { RenamedFileItemType, RenamedItem } from '../types/obsidian';
import { checkRenamedFileItemType } from './checkRenamedFileItemType';
import doModify from './doModify';

export async function renamer(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>) {
  const renamedFileItemType = checkRenamedFileItemType(plugin, fileItem)
  if (!renamedFileItemType) {
    console.log(fileItem.file.name + ": undifined -->", renamedFileItemType);
    return
  }
  console.log(fileItem.file.name + "-->", renamedFileItemType);
  //do rename
  rename(plugin, fileItem, renamedFileItemType)
}


export async function rename(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>, type: RenamedFileItemType) {
  // file:alone:notTheCluster
  if (type === "file:alone:notTheCluster") {
    await doModify.file.updateClusterTagFrontmatter(plugin, fileItem as RenamedItem<TFile>)
    await doModify.file.updateParentFrontmatter(plugin, fileItem as RenamedItem<TFile>)
    await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
  }
  // file:alone:theCluster 
  if (type === "file:alone:theCluster") {
    await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
  }
  // file:hasChildren:notTheCluster
  if (type === "file:hasChildren:notTheCluster") {
    await doModify.file.updateClusterTagFrontmatter(plugin, fileItem as RenamedItem<TFile>)
    await doModify.file.updateParentFrontmatter(plugin, fileItem as RenamedItem<TFile>)
    await doModify.file.renameChildrenFolder(plugin, fileItem as RenamedItem<TFile>)
    await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
  }
  // file:hasChildren:theCluster
  if (type === "file:hasChildren:theCluster") {
    await doModify.file.renameChildrenFolder(plugin, fileItem as RenamedItem<TFile>)
    await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
  }
  // file:hasChildren:theCluster
  if (type === "folder:theCluster:unLinked") {
    await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
  }

}


