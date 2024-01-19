import { App, Plugin, Menu, Notice, Editor, MarkdownView, View, TFolder } from "obsidian";
import familyModal from "./src/createFamily/familyModal";
import deleteActiveNoteModal from "./src/createFamily/deleteActiveNoteModal";
import { NewFileLocation } from "./src/util/enums";
import { firstClusterTemplate } from "./src/createFamily/templates";

// FIX fix file-menu when right click on folder

export default class AdvancedNewFilePlugin extends Plugin {
  actions = new Map();

  async onload() {
    console.log("loading Cluster plugin");
    // set the curser position 
    this.registerEvent(this.app.workspace.on("file-open", async (file) => {
      const getActiveFile = this.app.workspace.getActiveFile()
      const frontmatterProperties = getActiveFile !== null ? this.app.metadataCache.getFileCache(getActiveFile)?.frontmatter : null;
      /*
      2 : frontmatter 2 dashed lines ---
      2 : control table (new son , new brother ...)
      1 : empty line between frontmatter and control table
      */
      let linesNumber = 2 + 2 + 1
      // check if generation property exist or Orphan tags exist
      const orphanTag = frontmatterProperties?.tags?.find((item: string) => item == "Orphan")
      if (frontmatterProperties && (frontmatterProperties.generation || orphanTag)) {
        const orphanTag = frontmatterProperties.tags.find((item: string) => item == "Orphan")
        console.log(orphanTag)
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
      id: "New-Brother",
      name: "New brother",
      callback: () => {
        this.createClusterFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newBrother" ,undefined).open();
      },
    });
    this.addCommand({
      id: "New-Son",
      name: "New son",
      callback: () => {
        this.createClusterFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newSon" ,undefined).open();
      },
    });
    this.addCommand({
      id: "New-Cluster",
      name: "new cluster",
      callback: () => {
        this.createClusterFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newCluster",undefined).open();
      },
    });
    this.addCommand({
      id: "Delete-Active-Note",
      name: "Delete active note",
      callback: () => {
        this.createClusterFolder();
        this.checkForAdvancedURI_Plugin();
        new deleteActiveNoteModal(this.app, NewFileLocation.NewTab, "deleteNote").open();
      },
    });
    this.addCommand({
      id: "New-Orphan",
      name: "New orphan",
      callback: () => {
        this.createClusterFolder();
        this.checkForAdvancedURI_Plugin();
        new familyModal(this.app, NewFileLocation.NewTab, "newOrphan",undefined ).open();
      },
    });

    //- Ribbon Icon
    this.addRibbonIcon("baby", "Create Son to the current active note", (evt) => {
      this.createClusterFolder();
      this.checkForAdvancedURI_Plugin();
      new familyModal(this.app, NewFileLocation.NewTab, "newSon",undefined).open();
    });
    this.addRibbonIcon("git-compare", "Create Brother to the current active note", (evt) => {
      this.createClusterFolder();
      this.checkForAdvancedURI_Plugin();
      new familyModal(this.app, NewFileLocation.NewTab, "newBrother",undefined).open();
    });
    this.addRibbonIcon("folder-git-2", "Create New Cluster", (evt) => {
      this.createClusterFolder();
      this.checkForAdvancedURI_Plugin();
      new familyModal(this.app, NewFileLocation.NewTab, "newCluster",undefined).open();
    });
    //- file-menu
    this.registerEvent(
      
			this.app.workspace.on("file-menu", (menu, file) => {
        menu.addSeparator()
			})
		  );
    this.registerEvent(
      
			this.app.workspace.on("file-menu", (menu, file) => {
			  menu.addItem((item) => {
				item
					.setTitle("New son")
					.setIcon("baby")
					.onClick(async () => {
            this.createClusterFolder();
            this.checkForAdvancedURI_Plugin();
            const graphActiveFile = file
            new familyModal(this.app, NewFileLocation.NewTab, "newSon" ,graphActiveFile).open();
					});
			  });
			})
		  );
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        menu.addItem((item) => {
        item
          .setTitle("New brother")
          .setIcon("git-compare")
          .onClick(async () => {
            this.createClusterFolder();
            this.checkForAdvancedURI_Plugin();
            const graphActiveFile = file
            new familyModal(this.app, NewFileLocation.NewTab, "newBrother" ,graphActiveFile).open();
          });
        });
      })
      );
  }
  //- createClusterFolder

  async createClusterFolder() {
    try {
      //orphans folder
      const orphanFolderExists = await this.app.vault.adapter.exists("/ORPHANS");
      if (!orphanFolderExists) await this.app.vault.createFolder("/ORPHANS");
      //cluster folder
      const folderExists = await this.app.vault.adapter.exists("/CLUSTERS");
      if (!folderExists) {
        await this.app.vault.createFolder("/CLUSTERS");
      }
      //@ts-ignore
      const isOtherClusters = this.app.vault.getRoot().children?.find((item : any) => item instanceof TFolder && item.name =="CLUSTERS").children.length
      if(isOtherClusters == 0){
        const fileExists = await this.app.vault.adapter.exists("/CLUSTERS/First-cluster.md");

        if (!fileExists) await this.app.vault.create("/CLUSTERS/First-cluster.md", firstClusterTemplate);

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
