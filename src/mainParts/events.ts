import { Plugin, TFile } from "obsidian";
import P from "src/util/P";

export function addEvents(plugin: Plugin) {
  // watch if file opened
  plugin.registerEvent(
    this.app.workspace.on("file-open", async (file: TFile) => {
      if (file) {
        await P.buttonsLine(this.app, file, this.settings);	// Add Cluster Buttons 
        await P.coloringTreePanel(this.app, file);
        this.settings.foldProperties ? await P.foldPropertiesElement(this.app, file) : null; // Fold Properties
        await P.addUnsortedFilesCounter(this.app);
        await P.unSortedObserver(this.app);
      }
    }),
  );
}