import { TFile, TFolder, Plugin, TAbstractFile } from 'obsidian';
import { RenamedFileItemType, RenamedItem } from '../types/obsidian';
import { checkRenamedFileItemType } from './checkRenamedFileItemType';
import doModify from './doModify';
import isItem from './isItem';
//_ renamer
export async function renamer(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>) {
  // check if the name CLUSTERS or ORPHANS
  if (await isItem.isCLUSTERSorORPHANS(plugin, fileItem)) {
    return
  }
  const renamedFileItemType = checkRenamedFileItemType(plugin, fileItem)
  if (!renamedFileItemType) {
    console.log(fileItem.file.name + ": undefined -->", renamedFileItemType);
    return
  }
  // console.log(fileItem.file.name + "-->", renamedFileItemType);

  //do rename
  await rename(plugin, fileItem, renamedFileItemType)
}


//_ rename
async function rename(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>, type: RenamedFileItemType) {
  // file:alone:notTheCluster
  if (type === "file:alone:notTheCluster") {
    const forbid = await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.file.updateClusterTagFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.updateParentFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.updateGenerationFrontmatter(plugin, fileItem as RenamedItem<TFile>)
    }
  }
  // file:alone:theCluster 
  if (type === "file:alone:theCluster") {
    const forbid = await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.file.updateClusterTagFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.updateGenerationFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      // remove parent if there is one need time to work as expected
      setTimeout(async () => { await doModify.file.updateParentFrontmatter(plugin, fileItem as RenamedItem<TFile>) }, 100)
    }
  }
  // file:hasChildren:notTheCluster
  if (type === "file:hasChildren:notTheCluster") {
    const forbid = await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.file.updateClusterTagFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.updateParentFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.updateGenerationFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.renameChildrenFolder(plugin, fileItem as RenamedItem<TFile>)
    }
  }
  // file:hasChildren:theCluster
  if (type === "file:hasChildren:theCluster") {
    const forbid = await doModify.file.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.file.renameChildrenFolder(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.updateClusterTagFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      await doModify.file.updateGenerationFrontmatter(plugin, fileItem as RenamedItem<TFile>)
      // remove parent if there is one need time to work as expected
      setTimeout(async () => { await doModify.file.updateParentFrontmatter(plugin, fileItem as RenamedItem<TFile>) }, 100)
    }
  }
  //= folders
  // folder:theCluster:unLinked
  if (type === "folder:theCluster:unLinked") {
    const forbid = await doModify.folder.forbidClusterRenaming(plugin, fileItem as RenamedItem<TFile>)
    if (!forbid) {
      await doModify.folder.renameLinkedFile(plugin, fileItem as RenamedItem<TFolder>)
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


