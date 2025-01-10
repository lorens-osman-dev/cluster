import { Plugin } from "obsidian";
import familyModal from "../createFamily/familyModal";
import { createClustersAndOrphansFolder } from "../createFamily/createClustersAndOrphansFolder";
import { NewFileLocation } from '../util/U';
import deleteActiveNoteModal from "src/createFamily/deleteActiveNoteModal";
import SimpleFocusClass from "src/focus/simpleFocus";
const SimpleFocus = new SimpleFocusClass();


export function addCommands(plugin: Plugin) {
  plugin.addCommand({
    id: "New-Cluster",
    name: "new cluster",
    callback: () => {
      createClustersAndOrphansFolder(plugin.app);
      new familyModal(
        plugin.app,
        NewFileLocation.NewTab,
        "newCluster",
        undefined,
      ).open();
    },
  });
  plugin.addCommand({
    id: "New-Son",
    name: "New son",
    callback: () => {
      createClustersAndOrphansFolder(plugin.app);
      new familyModal(
        plugin.app,
        NewFileLocation.NewTab,
        "newSon",
        undefined,
      ).open();
    },
  });
  plugin.addCommand({
    id: "New-Brother",
    name: "New brother",
    callback: () => {
      createClustersAndOrphansFolder(plugin.app);
      new familyModal(
        plugin.app,
        NewFileLocation.NewTab,
        "newBrother",
        undefined,
      ).open();
    },
  });
  plugin.addCommand({
    id: "New-Orphan",
    name: "New orphan",
    callback: () => {
      createClustersAndOrphansFolder(plugin.app);
      new familyModal(
        plugin.app,
        NewFileLocation.NewTab,
        "newOrphan",
        undefined,
      ).open();
    },
  });
  plugin.addCommand({
    id: "Delete-Active-Note",
    name: "Delete active note",
    callback: () => {
      createClustersAndOrphansFolder(plugin.app);
      new deleteActiveNoteModal(
        plugin.app,
        NewFileLocation.NewTab,
        "deleteNote",
      ).open();
    },
  });
  plugin.addCommand({
    id: "simple-focus-exit-focus",
    name: "Exit focus",
    callback: () => {
      SimpleFocus.exitFocus()
    },
  });
  plugin.addCommand({
    id: "simple-focus-enter-focus",
    name: "Enter focus",
    callback: () => {
      const file = plugin.app.workspace.getActiveFile();
      if (file?.path) {
        SimpleFocus.enterFocus(file.path)
      }
    },
  });
}