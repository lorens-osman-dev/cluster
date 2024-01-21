import { App, Plugin, Menu, Notice, Editor, MarkdownView, View, TFolder, TFile, WorkspaceWindow } from "obsidian";
import familyModal from "./src/createFamily/familyModal";
import deleteActiveNoteModal from "./src/createFamily/deleteActiveNoteModal";
import { NewFileLocation } from "./src/util/enums";
import { firstClusterTemplate } from "./src/createFamily/templates";
import { buttonsLine } from "./src/createFamily/buttons";
import { coloringTreePanel } from "./src/createFamily/coloringTreePanel";

const clusters = "CLUSTERS"
const orphans = "ORPHANS"
export default class clusterPlugin extends Plugin {
  actions = new Map();

  async onload() {
    console.log("loading Cluster plugin");

     


    this.registerEvent(this.app.workspace.on("file-open", async (file) => {

      
      if(file){
        //- Add Buttons
        await buttonsLine(this.app , file )
        
        //- Coloring Tree Panel
        coloringTreePanel(this.app , file)
      }
 
     
      //-set the curser position 
      const frontmatterProperties = file !== null ? this.app.metadataCache.getFileCache(file)?.frontmatter : null
      /*
      2 : frontmatter 2 dashed lines ---
      2 : control table (new son , new brother ...)
      1 : empty line between frontmatter and control table
      */
      let linesNumber = 2 + 2 + 1
      // check if generation property exist or Orphan tags exist
      const orphanTag = frontmatterProperties?.tags?.find((item: string) => item == "Orphan")
      if (frontmatterProperties && (frontmatterProperties.generation !== undefined || orphanTag)) {
        const tagsNumber = frontmatterProperties?.tags?.length ?? 0;
        linesNumber = linesNumber + tagsNumber
        for (const key in frontmatterProperties) {
          linesNumber++
        }
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        view?.editor?.setCursor(linesNumber, 0)
      }
    }));
       
    //-Check For Advanced URI _Plugin
    this.checkForAdvancedURI_Plugin();
    //- Commands
    this.addCommand({
      id: "New-Cluster",
      name: "new cluster",
      callback: () => {
        this.createClustersAndOrphansFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newCluster",undefined).open();
      },
    });
    this.addCommand({
      id: "New-Son",
      name: "New son",
      callback: () => {
        this.createClustersAndOrphansFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newSon" ,undefined).open();
      },
    });
    this.addCommand({
      id: "New-Brother",
      name: "New brother",
      callback: () => {
        this.createClustersAndOrphansFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newBrother" ,undefined).open();
      },
    });
    this.addCommand({
      id: "New-Orphan",
      name: "New orphan",
      callback: () => {
        this.createClustersAndOrphansFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newOrphan",undefined ).open();
      },
    });
    this.addCommand({
      id: "Delete-Active-Note",
      name: "Delete active note",
      callback: () => {
        this.createClustersAndOrphansFolder();
        this.checkForAdvancedURI_Plugin();
        new deleteActiveNoteModal(this.app, NewFileLocation.NewTab, "deleteNote").open();
      },
    });

    //- Ribbon Icon
    this.addRibbonIcon("folder-git-2", "Create New Cluster", (evt) => {
      this.createClustersAndOrphansFolder();
      this.checkForAdvancedURI_Plugin();
      new familyModal(this.app, NewFileLocation.NewTab, "newCluster",undefined).open();
    });
    //- file-menu
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
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
                  this.createClustersAndOrphansFolder();
                  this.checkForAdvancedURI_Plugin();
                  const graphActiveFile = file
                  new familyModal(this.app, NewFileLocation.NewTab, "newCluster", graphActiveFile).open();
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
                this.createClustersAndOrphansFolder();
                this.checkForAdvancedURI_Plugin();
                const graphActiveFile = file
                new familyModal(this.app, NewFileLocation.NewTab, "newSon", graphActiveFile).open();
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
                this.createClustersAndOrphansFolder();
                this.checkForAdvancedURI_Plugin();
                const graphActiveFile = file
                new familyModal(this.app, NewFileLocation.NewTab, "newBrother", graphActiveFile).open();
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
              .setIcon("git-commit-vertical")
              .onClick(async () => {
                this.createClustersAndOrphansFolder();
                this.checkForAdvancedURI_Plugin();
                const graphActiveFile = file
                new familyModal(this.app, NewFileLocation.NewTab, "newOrphan", graphActiveFile).open();
              });
          });
        }

      })
      
    );

  }
  //- Create Cluster and Orphans Folder
  async createClustersAndOrphansFolder() {
    try {
      //orphans folder
      const orphansFolderExists = await this.app.vault.adapter.exists(`/${orphans}`);
      if (!orphansFolderExists) await this.app.vault.createFolder(`/${orphans}`);
      //cluster folder
      const clusterFolderExists = await this.app.vault.adapter.exists(`/${clusters}`);
      if (!clusterFolderExists) {
        await this.app.vault.createFolder(`/${clusters}`);
      }
      //@ts-ignore
      const isOtherClusters = this.app.vault.getRoot().children?.find((item : any) => item instanceof TFolder && item.name ==clusters).children.length
      if(isOtherClusters == 0){
        const fileExists = await this.app.vault.adapter.exists(`/${clusters}/First-cluster.md`);
        if (!fileExists) await this.app.vault.create(`/${clusters}/First-cluster.md`, firstClusterTemplate);
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
    console.log("unloading Cluster plugin");
  }
}
