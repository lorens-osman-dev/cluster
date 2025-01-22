import { Plugin, TFile } from "obsidian";
import { clusterPluginSettings } from "src/settings/settings";
import P from "src/util/P";
import { getElementsObj, newNavTreeStart } from "../navtree/naveTree";
interface ExtendedPlugin extends Plugin {
  settings: clusterPluginSettings;
}


export function addEvents(plugin: ExtendedPlugin) {
  // watch if file opened
  plugin.registerEvent(
    plugin.app.workspace.on("file-open", async (file: TFile) => {
      if (file) {
        await P.buttonsLine(plugin.app, file, plugin.settings);	// Add Cluster Buttons 
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
      setTimeout(() => P.newNavTreeStart(plugin), 500)
    }),
  );

  plugin.registerEvent(
    plugin.app.workspace.on('deleteToMove', (data) => {
      const dataPathMD = `${data.path}.md`
      const elements = getElementsObj(plugin)
      const targetCon = elements?.folders.find(folder => folder.file.path === data.path)?.selfEl
      const toMove = Array.from(targetCon?.childNodes || []).find(
        (item) => (item as HTMLElement).classList.contains("toMove")
      ) as HTMLElement | null;
      // console.log("toMove:", toMove);
      const newTargetCon = elements?.oldToMoveElements.find(child => child.selfEl.getAttribute("data-path") == dataPathMD)
      console.log("newTargetCon:", newTargetCon);
      // console.log("oldTargetCon:", oldTargetCon);
      // if (!elements) return
      // elements.forEach((child) => { console.log(child) })
    })
  );
}