import { TAbstractFile, TFile, Plugin } from "obsidian";
import { renamer } from "../renamer/renamer";
import { RenamedItem } from "src/types/obsidian";


const renamer2 = async (plugin: Plugin, getActiveFile: TFile) => {
  const partsOfPath = getActiveFile.path.split("/")
  const renamedFile: RenamedItem<TAbstractFile> = {
    file: getActiveFile,
    oldPath: getActiveFile.path,
    oldParent: partsOfPath[partsOfPath.length - 2],
    newPath: getActiveFile.path,
    newParent: getActiveFile.parent?.name as string
  }
  await renamer(plugin, renamedFile)
  return
}

export default renamer2