import { App, Plugin, Menu, Notice, Editor, MarkdownView, View, TFolder } from "obsidian";
import familyModal from "./src/createFamily/familyModal";
import deleteActiveNoteModal from "./src/createFamily/deleteActiveNoteModal";
import { NewFileLocation } from "./src/util/enums";
import { firstClusterTemplate } from "./src/createFamily/templates";

export default class AdvancedNewFilePlugin extends Plugin {
  actions = new Map();

  async onload() {
    console.log("loading plugin");
    

    //-Check For Advanced URI _Plugin
    this.checkForAdvancedURI_Plugin();
    //- Commands
    this.addCommand({
      id: "New-Brother",
      name: "newBrother",
      callback: () => {
        this.createClusterFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newBrother").open();
      },
    });
    this.addCommand({
      id: "New-Son",
      name: "newSon",
      callback: () => {
        this.createClusterFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newSon").open();
      },
    });
    this.addCommand({
      id: "New-Cluster",
      name: "newCluster",
      callback: () => {
        this.createClusterFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newCluster").open();
      },
    });
    this.addCommand({
      id: "Delete-Active-Note",
      name: "DeleteActiveNote",
      callback: () => {
        this.createClusterFolder();
        this.checkForAdvancedURI_Plugin();
        new deleteActiveNoteModal(this.app, NewFileLocation.NewTab, "deleteNote").open();
      },
    });

    //- Ribbon Icon
    this.addRibbonIcon("baby", "Create Son to the current active note", (evt) => {
      this.createClusterFolder();
      this.checkForAdvancedURI_Plugin();
      new familyModal(this.app, NewFileLocation.NewTab, "newSon").open();
    });
    this.addRibbonIcon("git-compare", "Create Brother to the current active note", (evt) => {
      this.createClusterFolder();
      this.checkForAdvancedURI_Plugin();
      new familyModal(this.app, NewFileLocation.NewTab, "newBrother").open();
    });
    this.addRibbonIcon("folder-git-2", "Create New Cluster", (evt) => {
      this.createClusterFolder();
      this.checkForAdvancedURI_Plugin();
      new familyModal(this.app, NewFileLocation.NewTab, "newCluster").open();
    });
  }
  //- createClusterFolder
  async createClusterFolder() {
    try {
      const folderExists = await this.app.vault.adapter.exists("/[CLUSTERS]");
      if (!folderExists) await this.app.vault.createFolder("/[CLUSTERS]");
      //@ts-ignore
      const isOtherClusters = this.app.vault.getRoot().children?.find((item : any) => item instanceof TFolder && item.name =="[CLUSTERS]").children.length
      if(isOtherClusters == 0){
        const fileExists = await this.app.vault.adapter.exists("/[CLUSTERS]/First-cluster.md");

        if (!fileExists) await this.app.vault.create("/[CLUSTERS]/first-cluster.md", firstClusterTemplate);

      }
     
    } catch (error) {
      console.log(error);
    }
  }
  //- checkForAdvancedURI_Plugin
  checkForAdvancedURI_Plugin() {
    //@ts-ignore
    if (!this.app.plugins.enabledPlugins.has("obsidian-advanced-uri")) {
      new Notice(
`------------------------------------------
(!) INFO (!) 
Install and enable Advanced URI plugin for:
Create Son, Create Brother links to work
------------------------------------------`,
        3e3
      );
    }
  }

  onunload() {
    console.log("unloading plugin");
  }
}
