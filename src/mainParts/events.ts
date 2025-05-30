import { Plugin, TAbstractFile, TFile } from "obsidian";
import { clusterPluginSettings } from "src/settings/settings";
import P from "src/util/P";
import { getElementsObj } from "../navtree/naveTree";
import { renamer } from "src/renamer/renamer";
import { RenamedItem } from "src/types/obsidian";

interface ExtendedPlugin extends Plugin {
  settings: clusterPluginSettings;
}

export function addEvents(plugin: ExtendedPlugin) {
  // watch if file opened
  plugin.registerEvent(
    plugin.app.workspace.on("file-open", async (file: TFile) => {
      if (file) {
        await P.buttonsLine(plugin, file, plugin.settings);	// Add Cluster Buttons 
        await P.coloringTreePanel(plugin.app, file);
        plugin.settings.foldProperties ? await P.foldPropertiesElement(plugin.app, file) : null; // Fold Properties
        await P.unsorted.addUnsortedFilesCounter(plugin.app);
        await P.unsorted.unSortedObserver(plugin.app);
      }
    }),
  );
  // watch if file opened
  plugin.registerEvent(
    plugin.app.workspace.on("file-open", async () => {
      setTimeout(() => P.newNavTreeStart(plugin), 100)
    }),
  );
  // watch if layout-change
  plugin.registerEvent(
    plugin.app.workspace.on("layout-change", async () => {
      setTimeout(() => P.newNavTreeStart(plugin), 100)
    }),
  );
  // watch if file renamed
  plugin.registerEvent(
    plugin.app.vault.on("rename", async (file, oldPath) => {

      if (file && file.parent && (oldPath.startsWith("CLUSTERS") || oldPath.startsWith("ORPHANS"))) {
        const partsOfOldPath = oldPath.split("/")
        const renamedFile: RenamedItem<TAbstractFile> = {
          file: file,
          oldPath: oldPath,
          oldParent: partsOfOldPath[partsOfOldPath.length - 2],
          newPath: file.path,
          newParent: file.parent.name
        }
        await renamer(plugin, renamedFile)
      }
    })
  );
  // watch if custom event deleteToMove
  plugin.registerEvent(
    plugin.app.workspace.on('deleteToMove', (data) => {
      const dataPathMD = `${data.path}.md`
      const elements = getElementsObj(plugin)
      const newTargetCon = elements?.oldToMoveElements.find(child => child.selfEl.getAttribute("data-path") == dataPathMD)
      if (newTargetCon) {
        newTargetCon.selfEl.style.display = "flex"
        // remove g0 g1 etc classes and toMove class 
        const classesToRemove = Array.from(newTargetCon.innerEl.classList).filter(cls => /^g.*\d$/.test(cls));
        newTargetCon.innerEl.removeClasses([...classesToRemove, "toMove"]);
        newTargetCon.selfEl.appendChild(newTargetCon.innerEl)
      }
    })
  );
}