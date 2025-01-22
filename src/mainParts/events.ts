import { Plugin, TFile } from "obsidian";
import { clusterPluginSettings } from "src/settings/settings";
import P from "src/util/P";
import { newNavTreeStart } from "../navtree/naveTree";
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
      console.log('Custom event received:', data);
    })
  );
}