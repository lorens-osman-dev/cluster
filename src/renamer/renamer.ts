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
    const forbid = await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.file.updateClusterTagFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.updateParentFrontmatter(plugin, fileItem as RenamedItem<TFile>)
    }
  }
  // file:alone:theCluster 
  if (type === "file:alone:theCluster") {
    const forbid = await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      // Add any additional logic if needed
    }
  }
  // file:hasChildren:notTheCluster
  if (type === "file:hasChildren:notTheCluster") {
    const forbid = await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.file.updateClusterTagFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.updateParentFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.renameChildrenFolder(plugin, fileItem as RenamedItem<TFile>)
    }
  }
  // file:hasChildren:theCluster
  if (type === "file:hasChildren:theCluster") {
    const forbid = await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.file.renameChildrenFolder(plugin, fileItem as RenamedItem<TFile>)
    }
  }
  //= folders
  // folder:theCluster:unLinked
  if (type === "folder:theCluster:unLinked") {
    const forbid = await doModify.folder.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      // Add any additional logic if needed
    }
  }
  // folder:theCluster:linked
  if (type === "folder:theCluster:linked") {
    const forbid = await doModify.folder.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.folder.renameLinkedFile(plugin, fileItem as RenamedItem<TFolder>)
    }
  }
  // folder:notTheCluster:unLinked
  if (type === "folder:notTheCluster:unLinked") {
    const forbid = await doModify.folder.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.folder.renameLinkedFile(plugin, fileItem as RenamedItem<TFolder>)
    }
  }
  // folder:notTheCluster:linked
  if (type === "folder:notTheCluster:linked") {
    const forbid = await doModify.folder.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.folder.renameLinkedFile(plugin, fileItem as RenamedItem<TFolder>)
    }
  }
}


