import { App, normalizePath, Platform, TFolder, Notice, Modal, setIcon, Plugin } from "obsidian";
import { path } from '../util/utils';
import svgElements from "./svg";
import { templates, clusterTemplate, orphanTemplate } from "./templates";
import { NewFileLocation } from '../util/U';
import renamer2 from "./renamer2";



const clusters = "CLUSTERS"
const orphans = "ORPHANS"
export default class familyModal extends Modal {
  app: App;
  plugin: Plugin
  mode: NewFileLocation;
  folder: TFolder;
  newDirectoryPath: string;
  inputEl: HTMLInputElement;
  shouldMakeDir: string | undefined;
  inputListener: any;
  createType: string;
  graphActiveFile: any
  constructor(plugin: Plugin, mode: NewFileLocation, createType: string, graphActiveFile: any) {

    super(plugin.app);
    this.app = plugin.app;
    this.graphActiveFile = graphActiveFile
    this.createType = createType;
    this.mode = mode;
    this.plugin = plugin

    //#region Create input
    this.inputEl = document.createElement('input');
    this.inputEl.type = 'text';
    this.inputEl.className = 'prompt-input';
    //#endregion

    //#region Make modal
    this.modalEl.className = 'prompt';

    // get current active file
    let getActiveFile;
    if (this.graphActiveFile == undefined) {
      // get the active file from current workspace
      getActiveFile = this.app.workspace.getActiveFile();
    } else {
      // pass active file from graph or file tree
      getActiveFile = this.graphActiveFile;
    }


    //svg and placeholders
    if (getActiveFile === null) {
      if (this.createType == "newCluster") {
        this.inputEl.placeholder = `Type the new Cluster name`;
        this.modalEl.appendChild(svgElements().cluster());
      } else if (this.createType == "newOrphan") {
        this.inputEl.placeholder = `Type the new Orphan name`;
        this.modalEl.appendChild(svgElements().orphan());
      } else {
        this.inputEl.addClasses(["prompt-input", "inputDelete"])
        this.modalEl.appendChild(svgElements().noThing());
        const text = document.createElement('div');
        text.innerText = `Child ?! Sibling ?! of what??\nNo active file in the work space, Press ESC`
        text.addClass("nothingMsg")

        this.modalEl.appendChild(text);
      }


    } else if (this.createType == "newCluster") {
      this.inputEl.placeholder = `Type the new Cluster name`;
      this.modalEl.appendChild(svgElements().cluster());
    } else if (this.createType == "newChild") {
      this.inputEl.placeholder = `Type the child name of [${getActiveFile.basename}] note`;
      this.modalEl.appendChild(svgElements().child());
    } else if (this.createType == "newSibling") {
      this.inputEl.placeholder = `Type the sibling name of [${getActiveFile.basename}] note`;
      this.modalEl.appendChild(svgElements().sibling());
    } else if (this.createType == "newOrphan") {
      this.inputEl.placeholder = `Type the new Orphan name`;
      this.modalEl.appendChild(svgElements().orphan());
    }


    //input
    this.modalEl.appendChild(this.inputEl);

    //#endregion

    //#region Buttons
    // ok button ✓
    const okBtn = document.createElement('div');
    setIcon(okBtn, "check")
    okBtn.classList.add("btn", "ok");
    okBtn.addEventListener("click", () => {
      this.doWork(this.app)
      this.close();

    })

    this.modalEl.appendChild(okBtn);


    // escape button  ❌
    const noBtn = document.createElement('div');
    setIcon(noBtn, "x")
    noBtn.classList.add("btn", "no");
    noBtn.addEventListener("click", () => {
      this.close();

    })
    this.modalEl.appendChild(noBtn);
    //#endregion

    this.inputListener = this.listenInput.bind(this);


  }

  setFolder(folder: TFolder, newDirectoryPath: string, shouldMakeDir?: string) {
    this.folder = folder;
    this.newDirectoryPath = newDirectoryPath;
    this.shouldMakeDir = shouldMakeDir;
  }
  async doWork(appObject: App) {
    // get current active file
    let getActiveFile;
    if (this.graphActiveFile == undefined) {
      // get the active file from current workspace
      getActiveFile = this.app.workspace.getActiveFile();
    } else {
      // pass active file from graph or file tree
      getActiveFile = this.graphActiveFile;
    }


    const currentActiveFileName = getActiveFile?.basename;


    //-make clusterChild to the current active file
    if (this.createType == "newChild") {
      if (getActiveFile?.path?.startsWith(clusters)) {
        if (getActiveFile.basename.endsWith("-cluster")) {
          if ((getActiveFile.path.match(/\//g) || []).length == 1) {

            await renamer2(this.plugin, getActiveFile)
            setTimeout(async () => {
              const result = await templates(getActiveFile, "clusterChild");
              if (result.state) {
                const childNameFromInput = this.inputEl.value.trim();
                if (childNameFromInput.endsWith("-cluster")) {
                  new Notice("The name should'nt contain '-cluster' suffix", 3e3)
                  return
                }
                const childrenFolderPath = `${getActiveFile?.parent?.path}/${currentActiveFileName}`;
                await this.createDirectory(appObject, "", childrenFolderPath);
                const newCreatedChildrenFolder = getActiveFile.parent?.children?.find(
                  (item: any) => item instanceof TFolder && item.name == `${currentActiveFileName}`
                );

                // @ts-ignore
                this.setFolder(newCreatedChildrenFolder, "");
                renamer2(this.plugin, getActiveFile)
                await this.createNewNote(appObject, childNameFromInput, result.clusterChildTemplate);
                this.app.commands.executeCommandById('file-explorer:reveal-active-file')
              }
            }, 100)

          } else {
            new Notice("The Cluster should not be in this generation.\nChange the note name. \nOr move it to generation 0", 3e3)
          }

        }
        //-make normalChild to the current active file
        else if (!getActiveFile.basename.endsWith("-cluster")) {
          if (!((getActiveFile.path.match(/\//g) || []).length == 1)) {

            await renamer2(this.plugin, getActiveFile)
            setTimeout(async () => {
              const result = await templates(getActiveFile, "normalChild");
              if (result.state) {
                const childNameFromInput = this.inputEl.value.trim();
                if (childNameFromInput.endsWith("-cluster")) {
                  new Notice("The name should'nt contain '-cluster' suffix", 3e3)
                  return
                }
                const childrenFolderPath = `${getActiveFile?.parent?.path}/${currentActiveFileName}`;
                await this.createDirectory(appObject, "", childrenFolderPath);
                const newCreatedChildrenFolder = getActiveFile.parent?.children.find(
                  (item: any) => item instanceof TFolder && item.name == `${currentActiveFileName}`
                );

                // @ts-ignore
                this.setFolder(newCreatedChildrenFolder, "");
                await this.createNewNote(appObject, childNameFromInput, result.normalChildTemplate);
                this.app.commands.executeCommandById('file-explorer:reveal-active-file')
              }
            }, 100)



          } else {
            new Notice("The Cluster's name should ends with '-cluster' word.\nExample:'lorens-cluster' ,You need to change the note name.", 3e3)
          }

        }

      } else {
        new Notice("Create new child should not work outside [CLUSTERS] folder")
      }

    }
    //-make Sibling to the current active file
    else if (this.createType == "newSibling") {
      if (getActiveFile?.path.startsWith(clusters)) {
        // the next if statement to prevent make Sibling to a cluster
        if (currentActiveFileName?.endsWith("-cluster")) {
          new Notice(`You cant make Sibling to a cluster.\nCreate new cluster instead`);
        } else {

          await renamer2(this.plugin, getActiveFile)
          setTimeout(async () => {
            const result = await templates(getActiveFile, "sibling");

            if (result.state == true) {
              const siblingNameFromInput = this.inputEl.value.trim();
              if (siblingNameFromInput.endsWith("-cluster")) {
                new Notice("The name should'nt contain '-cluster' suffix", 3e3)
                return
              }
              this.setFolder(getActiveFile?.parent, "");
              this.createNewNote(appObject, siblingNameFromInput, result.siblingTemplate);
              this.app.commands.executeCommandById('file-explorer:reveal-active-file')

            }
          }, 100)
        }
      } else {
        new Notice("Create new sibling should not work outside [CLUSTERS] folder")
      }
    }
    //-make newOrphan 
    else if (this.createType == "newOrphan") {


      const rootChildren = this.app.vault.getRoot().children;
      const orphansFolder = rootChildren.find((item) => item instanceof TFolder && item.name == orphans);
      // @ts-ignore
      this.setFolder(orphansFolder, "");
      const orphanName = this.inputEl.value.trim()
      this.createNewNote(appObject, orphanName, orphanTemplate);
    }
    //-make newCluster to the current active file
    else if (this.createType == "newCluster") {


      const rootChildren = this.app.vault.getRoot().children;
      const clustersFolder = rootChildren.find((item) => item instanceof TFolder && item.name == clusters);
      // @ts-ignore
      this.setFolder(clustersFolder, "");
      if (this.inputEl.value == "") {
        this.inputEl.value = "Untitled"
      }
      const clusterName = `${(this.inputEl.value).trim()}-cluster`;
      this.createNewNote(appObject, clusterName.trim(), clusterTemplate());
    }

  }
  async listenInput(evt: KeyboardEvent) {
    if (evt.key === 'Enter') {
      // prevent enter after note creation
      evt.preventDefault();


      // get current active file
      let getActiveFile;
      if (this.graphActiveFile == undefined) {
        // get the active file from current workspace
        getActiveFile = this.app.workspace.getActiveFile();
      } else {
        // pass active file from graph or file tree
        getActiveFile = this.graphActiveFile;
      }

      if (getActiveFile === null) {
        this.close();

      } else {
        this.doWork(this.app)
        this.close();
      }

    }
  }

  onOpen() {
    this.inputEl.focus();
    this.inputEl.addEventListener('keydown', this.inputListener);
  }

  onClose() {
    this.inputEl.removeEventListener('keydown', this.inputListener);
  }

  //#region  createDirectory
  /**
   * Creates a directory (recursive) if it does not already exist.
   * This is a helper function that includes a workaround for a bug in the
   * Obsidian mobile app.
   */
  private async createDirectory(appObject: App, dir: string, newDirectoryPath: string): Promise<void> {
    const { vault } = appObject;
    const { adapter } = vault;
    const root = vault.getRoot().path;
    let directoryPath = '';
    if (newDirectoryPath == '') {
      directoryPath = path.join(this.folder.path, dir);
    } else {
      directoryPath = newDirectoryPath;
    }

    const directoryExists = appObject.vault.getAbstractFileByPath(directoryPath);
    // ===============================================================
    // -> Desktop App
    // ===============================================================
    if (!Platform.isIosApp) {
      if (!directoryExists) {
        return adapter.mkdir(normalizePath(directoryPath));
      }
    }
    // ===============================================================
    // -> Mobile App (IOS)
    // ===============================================================
    // This is a workaround for a bug in the mobile app:
    // To get the file explorer view to update correctly, we have to create
    // each directory in the path one at time.

    // Split the path into an array of sub paths
    // note: `normalizePath` converts path separators to '/' on all platforms
    // @example '/one/two/three/' ==> ['one', 'one/two', 'one/two/three']
    // @example 'one\two\three' ==> ['one', 'one/two', 'one/two/three']
    const subPaths: string[] = normalizePath(directoryPath)
      .split('/')
      .filter((part) => part.trim() !== '')
      .map((_, index, arr) => arr.slice(0, index + 1).join('/'));

    // Create each directory if it does not exist
    for (const subPath of subPaths) {
      const directoryExists = await adapter.exists(path.join(root, subPath));

      if (!directoryExists) {
        await adapter.mkdir(path.join(root, subPath));
      }
    }
  }
  //#endregion
  /**
   * Handles creating the new note
   * A new markdown file will be created at the given file path (`input`)
   * in the specified parent folder (`this.folder`)
   */
  async createNewNote(appObject: App, input: string, template: string): Promise<void> {
    const { vault } = appObject;
    const prependDirInput = path.join(this.newDirectoryPath, input);
    const { dir, name } = path.parse(prependDirInput);
    const directoryPath = path.join(this.folder.path, dir);

    const filePath = path.join(directoryPath, `${name}.md`);

    try {
      const fileExists = appObject.vault.getAbstractFileByPath(filePath);
      if (fileExists) {
        // If the file already exists, respond with error
        throw new Error(`${filePath} already exists`);
      }
      if (dir !== '') {
        //this.createDirectory(dir);
      }


      const File = await vault.create(filePath, template);


      // Create the file and open it in the active leaf
      let leaf = appObject.workspace.getLeaf(false);
      if (this.mode === NewFileLocation.NewPane) {
        //@ts-ignore
        leaf = appObject.workspace.splitLeafOrActive();
      } else if (this.mode === NewFileLocation.NewTab) {
        leaf = appObject.workspace.getLeaf(true);
      } else if (!leaf) {
        // default for active pane
        leaf = appObject.workspace.getLeaf(true);
      }
      await leaf.openFile(File);

    } catch (error) {
      new Notice(error.toString());
      console.log(error.toString());
    }
  }
}
