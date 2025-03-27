import { TFile, TFolder, TAbstractFile, Plugin } from 'obsidian';
import { RenamedFileItemType, RenamedItem } from "src/types/obsidian"
import U from 'src/util/U';
import isItem from './isItem';


export function checkRenamedFileItemType(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>): RenamedFileItemType | undefined {
  //# check 1
  const check1 = U.IF([
    [fileItem.file instanceof TFile, "the file is folder"],
    [isItem.isFileHasChildren(fileItem as RenamedItem<TFile>) === "alone", "the file has children"],
    [isItem.isFileCluster(plugin, fileItem as RenamedItem<TFile>) === "notTheCluster", "the file is cluster"],
  ])

  if (check1 === true) {
    return 'file:alone:notTheCluster';
  }
  //# check 2
  const check2 = U.IF([
    [fileItem.file instanceof TFile, "the file is folder"],
    [isItem.isFileHasChildren(fileItem as RenamedItem<TFile>) === "alone", "the file has children"],
    [isItem.isFileCluster(plugin, fileItem as RenamedItem<TFile>) === "theCluster", "the file is not cluster"],
  ])
  if (check2 === true) {
    return 'file:alone:theCluster';
  }
  //# check3
  const check3 = U.IF([
    [fileItem.file instanceof TFile, "the file is folder"],
    [isItem.isFileHasChildren(fileItem as RenamedItem<TFile>) === "hasChildren", "the file has not children"],
    [isItem.isFileCluster(plugin, fileItem as RenamedItem<TFile>) === "notTheCluster", "the file is cluster"],
  ])
  if (check3 === true) {
    return 'file:hasChildren:notTheCluster';
  }
  //# check4
  const check4 = U.IF([
    [fileItem.file instanceof TFile, "the file is folder"],
    [isItem.isFileHasChildren(fileItem as RenamedItem<TFile>) === "hasChildren", "the file has not children"],
    [isItem.isFileCluster(plugin, fileItem as RenamedItem<TFile>) === "theCluster", "the file is not cluster"],
  ])
  if (check4 === true) {
    return 'file:hasChildren:theCluster';
  }
  //= folders
  //# check5
  const check5 = U.IF([
    [fileItem.file instanceof TFolder, "the file is file"],
    [isItem.isFolderCluster(fileItem as RenamedItem<TFolder>) === "notTheCluster", "the folder is cluster"],
    [isItem.whatClusteringState(fileItem as RenamedItem<TFolder>) === "unLinked", "the folder linked"],
  ])

  if (check5 === true) {
    return 'folder:notTheCluster:unLinked';
  }
  //# check6
  const check6 = U.IF([
    [fileItem.file instanceof TFolder, "the file is file"],
    [isItem.isFolderCluster(fileItem as RenamedItem<TFolder>) === "notTheCluster", "the folder is cluster"],
    [isItem.whatClusteringState(fileItem as RenamedItem<TFolder>) === "linked", "the folder unlinked"],
  ])
  if (check6 === true) {
    return 'folder:notTheCluster:linked';
  }
  //# check7
  const check7 = U.IF([
    [fileItem.file instanceof TFolder, "the file is file"],
    [isItem.isFolderCluster(fileItem as RenamedItem<TFolder>) === "theCluster", "the folder not the cluster"],
    [isItem.whatClusteringState(fileItem as RenamedItem<TFolder>) === "unLinked", "the folder linked"],
  ])
  if (check7 === true) {
    return 'folder:theCluster:unLinked';
  }
  //# check8
  const check8 = U.IF([
    [fileItem.file instanceof TFolder, "the file is file"],
    [isItem.isFolderCluster(fileItem as RenamedItem<TFolder>) === "theCluster", "the folder not  cluster"],
    [isItem.whatClusteringState(fileItem as RenamedItem<TFolder>) === "linked", "the folder unlinked"],
  ])
  if (check8 === true) {
    return 'folder:theCluster:linked';
  }

  const undefinedFileStatus = {
    type: fileItem.file instanceof TFile ? "file" : "folder",
    isClusterIfFile: isItem.isFileCluster(plugin, fileItem as RenamedItem<TFile>),
    hasChildrenIfFile: isItem.isFileHasChildren(fileItem as RenamedItem<TFile>),
    clusteringStateIfFolder: isItem.whatClusteringState(fileItem as RenamedItem<TFolder>),
    isClusterIfFolder: isItem.isFolderCluster(fileItem as RenamedItem<TFolder>),
  }
  return undefinedFileStatus
}