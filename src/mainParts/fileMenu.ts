import { TFile, TFolder, Menu, Plugin } from "obsidian";
import familyModal from "../createFamily/familyModal";
import { createClustersAndOrphansFolder } from "../createFamily/createClustersAndOrphansFolder";
import { NewFileLocation } from '../util/U';
import SimpleFocusClass from "src/focus/simpleFocus";


const clusters = "CLUSTERS"
const orphans = "ORPHANS"

export function fileMenu(plugin: Plugin, SimpleFocus: SimpleFocusClass) {
  plugin.registerEvent(
    plugin.app.workspace.on("file-menu", (menu: Menu, file: TFile) => {
      //- Focus menu
      if (file) {
        menu.addItem((item) => {
          item
            .setTitle(SimpleFocus.isFocus ? "Exit focus" : "Focus")
            .setIcon(SimpleFocus.isFocus ? "log-out" : "focus")
            .onClick(async () => {
              SimpleFocus.toggleFocus(file?.path);
            });
        });
      }
      //- cluster menu
      if (
        (file instanceof TFile && file.parent instanceof TFolder && file.parent.name == clusters)
        ||
        (file instanceof TFolder && file.path.startsWith(clusters) && file.path.endsWith(clusters))
      ) {
        menu.addSeparator()
        menu.addItem((item) => {
          item
            .setTitle("New cluster")
            .setIcon("folder-git-2")
            .onClick(async () => {
              createClustersAndOrphansFolder(plugin.app);
              const graphActiveFile = file
              new familyModal(plugin.app, NewFileLocation.NewTab, "newCluster", graphActiveFile).open();
            });
        });
      }
      //- Child menu
      if (file instanceof TFile && file.path.startsWith(clusters)) {
        menu.addSeparator()
        menu.addItem((item) => {
          item
            .setTitle("New Child")
            .setIcon("baby")
            .onClick(async () => {
              createClustersAndOrphansFolder(plugin.app);
              const graphActiveFile = file
              new familyModal(plugin.app, NewFileLocation.NewTab, "newChild", graphActiveFile).open();
            });
        });
      }
      //- sibling menu
      if (
        (file instanceof TFile && file.path.startsWith(clusters))
        &&
        !(file instanceof TFile && file.parent instanceof TFolder && file.parent.name == clusters)
      ) {
        menu.addItem((item) => {
          item
            .setTitle("New sibling")
            .setIcon("git-compare")
            .onClick(async () => {
              createClustersAndOrphansFolder(plugin.app);
              const graphActiveFile = file
              new familyModal(plugin.app, NewFileLocation.NewTab, "newSibling", graphActiveFile).open();
            });
        });
      }
      //- orphan menu
      if (
        (file instanceof TFile && file.parent instanceof TFolder && file.parent.name == orphans)
        ||
        (file instanceof TFolder && file.path.startsWith(orphans) && file.path.endsWith(orphans))
      ) {
        menu.addSeparator()
        menu.addItem((item) => {
          item
            .setTitle("New orphan")
            .setIcon("disc")
            .onClick(async () => {
              createClustersAndOrphansFolder(plugin.app);
              const graphActiveFile = file
              new familyModal(plugin.app, NewFileLocation.NewTab, "newOrphan", graphActiveFile).open();
            });
        });
      }
    })

  );
}