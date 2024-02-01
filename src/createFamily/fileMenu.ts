import { TFile, TFolder, Menu } from "obsidian";
import familyModal from "./familyModal";
import { createClustersAndOrphansFolder } from "./createClustersAndOrphansFolder";
import { NewFileLocation } from "src/util/enums";

const clusters = "CLUSTERS"
const orphans = "ORPHANS"
//@ts-ignore
export function fileMenu(x) {
  //- file-menu
  x.registerEvent(
    x.app.workspace.on("file-menu", (menu: Menu, file: TFile) => {
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
              createClustersAndOrphansFolder(x.app);
              const graphActiveFile = file
              new familyModal(x.app, NewFileLocation.NewTab, "newCluster", graphActiveFile).open();
            });
        });
      }
      //- son menu
      if (file instanceof TFile && file.path.startsWith(clusters)) {
        menu.addSeparator()
        menu.addItem((item) => {
          item
            .setTitle("New son")
            .setIcon("baby")
            .onClick(async () => {
              createClustersAndOrphansFolder(x.app);
              const graphActiveFile = file
              new familyModal(x.app, NewFileLocation.NewTab, "newSon", graphActiveFile).open();
            });
        });
      }
      //- brother menu
      if (
        (file instanceof TFile && file.path.startsWith(clusters))
        &&
        !(file instanceof TFile && file.parent instanceof TFolder && file.parent.name == clusters)
      ) {
        menu.addItem((item) => {
          item
            .setTitle("New brother")
            .setIcon("git-compare")
            .onClick(async () => {
              createClustersAndOrphansFolder(x.app);
              const graphActiveFile = file
              new familyModal(x.app, NewFileLocation.NewTab, "newBrother", graphActiveFile).open();
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
              createClustersAndOrphansFolder(x.app);
              const graphActiveFile = file
              new familyModal(x.app, NewFileLocation.NewTab, "newOrphan", graphActiveFile).open();
            });
        });
      }

    })

  );
}