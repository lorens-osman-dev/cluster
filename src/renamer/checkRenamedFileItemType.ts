import { TFile, TFolder, Plugin, TAbstractFile } from 'obsidian';
import { RenamedFileItemType, RenamedItem } from "src/types/obsidian"
import { isFileHasChildren } from './isItem';


export function checkRenamedFileItemType(plugin: Plugin, fileItem: RenamedItem<TAbstractFile>): RenamedFileItemType | undefined {
  //_ if the file is cluster
  if (fileItem.file instanceof TFile) {
    const isThereChildrenFolder = isFileHasChildren(fileItem as RenamedItem<TFile>)
    if (isThereChildrenFolder) {
      return
    }
    return
  }

  //_   if (fileItem.file instanceof TFolder)   
}