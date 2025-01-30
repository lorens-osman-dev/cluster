import { TFile, TFolder, TAbstractFile } from 'obsidian';
import { RenamedFileItemType, RenamedItem } from "src/types/obsidian"
import U from 'src/util/U';
import isItem from './isItem';


export function checkRenamedFileItemType(fileItem: RenamedItem<TAbstractFile>): RenamedFileItemType | undefined {
  //# check 1
  const check1 = U.IF([
    [fileItem.file instanceof TFile, "the file is folder"],
    [isItem.isFileHasChildren(fileItem as RenamedItem<TFile>), "the file did'nt has children"],
    [isItem.isFileCluster(fileItem as RenamedItem<TFile>) === "notTheCluster", "the file is cluster"],
  ])
  if (check1) {
    return 'file:hasChildren:notTheCluster';
  }
  //# check 2
  const check2 = U.IF([
    [fileItem.file instanceof TFile, "the file is folder"],
    [isItem.isFileHasChildren(fileItem as RenamedItem<TFile>), "the file did'nt has children"],
    [isItem.isFileCluster(fileItem as RenamedItem<TFile>) === "theCluster", "the file is not cluster"],
  ])
  if (check2) {
    return 'file:hasChildren:theCluster';
  }
  //# check3
  const check3 = U.IF([
    [fileItem.file instanceof TFile, "the file is folder"],
    [isItem.isFileHasChildren(fileItem as RenamedItem<TFile>) === false, "the file has children"],
    [isItem.isFileCluster(fileItem as RenamedItem<TFile>) === "notTheCluster", "the file is cluster"],
  ])
  if (check3) {
    return 'file:alone:notTheCluster';
  }
  //# check4
  const check4 = U.IF([
    [fileItem.file instanceof TFile, "the file is folder"],
    [isItem.isFileHasChildren(fileItem as RenamedItem<TFile>) === false, "the file has children"],
    [isItem.isFileCluster(fileItem as RenamedItem<TFile>) === "theCluster", "the file is not cluster"],
  ])
  if (check4) {
    return 'file:alone:theCluster';
  }
  //# check5
  const check5 = U.IF([
    [fileItem.file instanceof TFolder, "the file is file"],
    [isItem.isFolderClusterOrNormal(fileItem as RenamedItem<TFolder>) === "cluster", "the folder not cluster"],
    [isItem.whatClusteringState(fileItem as RenamedItem<TFolder>) === "linked", "the folder unlinked"],
  ])
  if (check5) {
    return 'folder:cluster:linked';
  }
  //# check6
  const check6 = U.IF([
    [fileItem.file instanceof TFolder, "the file is file"],
    [isItem.isFolderClusterOrNormal(fileItem as RenamedItem<TFolder>) === "cluster", "the folder not cluster"],
    [isItem.whatClusteringState(fileItem as RenamedItem<TFolder>) === "unLinked", "the folder linked"],
  ])
  if (check6) {
    return 'folder:cluster:unLinked';
  }
  //# check7
  const check7 = U.IF([
    [fileItem.file instanceof TFolder, "the file is file"],
    [isItem.isFolderClusterOrNormal(fileItem as RenamedItem<TFolder>) === "normal", "the folder is cluster"],
    [isItem.whatClusteringState(fileItem as RenamedItem<TFolder>) === "unLinked", "the folder linked"],
  ])
  if (check7) {
    return 'folder:normal:unLinked';
  }
  //# check8
  const check8 = U.IF([
    [fileItem.file instanceof TFolder, "the file is file"],
    [isItem.isFolderClusterOrNormal(fileItem as RenamedItem<TFolder>) === "normal", "the folder is cluster"],
    [isItem.whatClusteringState(fileItem as RenamedItem<TFolder>) === "linked", "the folder unlinked"],
  ])
  if (check8) {
    return 'folder:normal:linked';
  }
}