import { App, Plugin } from "obsidian";
import familyModal from "./src/createFamily/familyModal";
import deleteActiveNoteModal from "./src/createFamily/deleteActiveNoteModal";
import { NewFileLocation } from "./src/util/enums";
import { buttonsLine } from "./src/createFamily/buttons";
import { coloringTreePanel, addUnsortedFilesCounter, unSortedObserver, foldPropertiesElement } from "./src/createFamily/coloringTreePanel";
import { createClustersAndOrphansFolder } from "./src/createFamily/createClustersAndOrphansFolder";
import { fileMenu } from "src/createFamily/fileMenu";
import { settingTab } from "./src/createFamily/settings";


const clusters = "CLUSTERS"
const orphans = "ORPHANS"



interface clusterPluginSettings {
  foldProperties: boolean;

  firstPageClusters: boolean;

  restBgClusters: boolean;
  newBG_clusters: string;
  newBG_orphans: string;
  restBgOrphans: boolean;
  buttonsLineContainerBG_clusters: string;
  buttonsLineContainerBG_orphans: string;
}

const DEFAULT_SETTINGS: Partial<clusterPluginSettings> = {
  foldProperties: true,

  firstPageClusters: true,

  restBgClusters: true,
  restBgOrphans: true,
  buttonsLineContainerBG_clusters: "var(--background-button-container-clusters)",
  buttonsLineContainerBG_orphans: "var(--background-button-container-orphans)"

};



export default class clusterPlugin extends Plugin {
  actions = new Map();// ! whats this 
  settings: clusterPluginSettings;

  async onload() {
    console.log("loading Cluster plugin");

    await this.loadSettings();

    this.addSettingTab(new settingTab(this.app, this));

    //- UN-SORTED Folder Styling
    setTimeout(async () => {
      await addUnsortedFilesCounter(this.app)
      await unSortedObserver()
    }, 1000);

    this.registerEvent(this.app.workspace.on("file-open", async (file) => {

      if (file) {

        //- Add Buttons
        await buttonsLine(this.app, file, this.settings)

        //- Coloring Tree Panel
        await coloringTreePanel(this.app, file)
        //- Fold Properties Element
        if (this.settings.foldProperties) {
          await foldPropertiesElement(this.app, file)
        }

      }

    }));

    //- Commands
    this.addCommand({
      id: "New-Cluster",
      name: "new cluster",
      callback: () => {
        createClustersAndOrphansFolder(this.app);
        new familyModal(this.app, NewFileLocation.NewTab, "newCluster", undefined).open();
      },
    });
    this.addCommand({
      id: "New-Son",
      name: "New son",
      callback: () => {
        createClustersAndOrphansFolder(this.app);
        new familyModal(this.app, NewFileLocation.NewTab, "newSon", undefined).open();
      },
    });
    this.addCommand({
      id: "New-Brother",
      name: "New brother",
      callback: () => {
        createClustersAndOrphansFolder(this.app);
        new familyModal(this.app, NewFileLocation.NewTab, "newBrother", undefined).open();
      },
    });
    this.addCommand({
      id: "New-Orphan",
      name: "New orphan",
      callback: () => {
        createClustersAndOrphansFolder(this.app);
        new familyModal(this.app, NewFileLocation.NewTab, "newOrphan", undefined).open();
      },
    });
    this.addCommand({
      id: "Delete-Active-Note",
      name: "Delete active note",
      callback: () => {
        createClustersAndOrphansFolder(this.app);
        new deleteActiveNoteModal(this.app, NewFileLocation.NewTab, "deleteNote").open();
      },
    });

    //- Ribbon Icon
    this.addRibbonIcon("folder-git-2", "Create New Cluster", (evt) => {
      createClustersAndOrphansFolder(this.app);
      new familyModal(this.app, NewFileLocation.NewTab, "newCluster", undefined).open();
    });
    //- File Menu
    fileMenu(this)

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    unSortedObserver(false)
    console.log("unloading Cluster plugin");
  }
}
