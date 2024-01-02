import { App, normalizePath, Platform, TFolder, Notice, Modal, Instruction, Vault ,MarkdownView} from "obsidian";
import { NewFileLocation } from '../util/enums';
import { path } from '../util/utils';
import svgElements from "./svg";
import { templates , clusterTemplate} from "./templates";


export default class familyModal extends Modal {
  mode: NewFileLocation;
  folder: TFolder;
  newDirectoryPath: string;
  inputEl: HTMLInputElement;
  shouldMakeDir: string | undefined;
  inputListener: EventListener;
  createType: string;
  constructor(app: App, mode: NewFileLocation, createType: string) {
    super(app);
    this.createType = createType;
    this.mode = mode;

    //#region Create input
    this.inputEl = document.createElement('input');
    this.inputEl.type = 'text';
    this.inputEl.className = 'prompt-input';
    //#endregion

    //#region Make modal
    this.modalEl.className = 'prompt';
   
    //svg and placeholders
    let getActiveFile = app.workspace.getActiveFile()

    if(getActiveFile === null){
 
      this.inputEl.addClasses(["prompt-input","inputDelete"])
      this.modalEl.appendChild(svgElements().noThing());
      const text = document.createElement('div');
      text.innerText = `No active file in the work space, Press ESC`
      text.addClass("delMsg")


    this.modalEl.appendChild(text);
    }else if (this.createType == "newSon") {
        this.inputEl.placeholder = `Type the son name of [${getActiveFile.basename}] note`;
        this.modalEl.appendChild(svgElements().son());
      } else if (this.createType == "newBrother") {
        this.inputEl.placeholder = `Type the brother name of [${getActiveFile.basename}] note`;
        this.modalEl.appendChild(svgElements().brother());
      } else if (this.createType == "newCluster") {
        this.inputEl.placeholder = `Type the new Cluster name`;
        this.modalEl.appendChild(svgElements().cluster());
      }
  
      //input
      this.modalEl.appendChild(this.inputEl);
  
      //#endregion
  
      this.inputListener = this.listenInput.bind(this);
    

  }

  setFolder(folder: TFolder, newDirectoryPath: string, shouldMakeDir?: string) {
    this.folder = folder;
    this.newDirectoryPath = newDirectoryPath;
    this.shouldMakeDir = shouldMakeDir;
  }
  //! This familyModal enter point
  async listenInput(evt: KeyboardEvent) {
    if (evt.key === 'Enter') {
      // prevent enter after note creation
      evt.preventDefault();

      console.log(evt)
      // get current active file
      const getActiveFile = app.workspace.getActiveFile();
  
      const currentActiveFileName = getActiveFile?.basename;


      //-make clusterSon to the current active file
       if (this.createType == "newSon") {
        if(getActiveFile?.path.startsWith("[CLUSTERS]")){
          if(getActiveFile.basename.endsWith("-cluster") ){
            if(  (getActiveFile.path.match(/\//g) || []).length == 1  ){
              const result = await templates(getActiveFile,"clusterSon");
              if (result.state) {
               
                const sonsFolderPath = `${getActiveFile?.parent?.path}/${currentActiveFileName}`;
                await this.createDirectory("", sonsFolderPath);
                const newCreatedSonsFolder = getActiveFile.parent?.children.find(
                  (item: any) => item instanceof TFolder && item.name == `${currentActiveFileName}`
                );
                
                // @ts-ignore
                this.setFolder(newCreatedSonsFolder, "");
                await this.createNewNote(this.inputEl.value , result.clusterSonTemplate);
              }
  
            }else{
              new Notice("The Cluster should not be in this generation.\nChange the note name. \nOr move it to generation 0",3e3)
            }
           
          }
          //-make normalSon to the current active file
          else if(!getActiveFile.basename.endsWith("-cluster")){
            if(!( (getActiveFile.path.match(/\//g) || []).length == 1 )){

              const result = await templates(getActiveFile,"normalSon");
              
              if (result.state) {
                const sonsFolderPath = `${getActiveFile!.parent!.path}/${currentActiveFileName?.toUpperCase()}`;
                await this.createDirectory("", sonsFolderPath);
                const newCreatedSonsFolder = getActiveFile.parent!.children.find(
                  (item: any) => item instanceof TFolder && item.name == currentActiveFileName!.toUpperCase()
                );
                
                // @ts-ignore
                this.setFolder(newCreatedSonsFolder, "");
                await this.createNewNote(this.inputEl.value , result.normalSonTemplate);
              }
              
            }else{
              new Notice("The Cluster's name should ends with '-cluster' word.\nExample:'lorens-cluster' ,You need to change the note name.",3e3)
            }
           
          }

        }else{
          new Notice("Create new son should not work outside [CLUSTERS] folder")
        }

      }
      //-make Brother to the current active file
      else if (this.createType == "newBrother") {
        if(getActiveFile!.path.startsWith("[CLUSTERS]")){
        // the next if statement to prevent make brother to a cluster
          if (currentActiveFileName!.endsWith("-cluster")) {
            new Notice(`You cant make Brother to a cluster.\nCreate new cluster instead`);
          } else {
            const result = await templates(getActiveFile,"brother");

            if (result.state == true) {
              this.setFolder( getActiveFile!.parent!, "");
              this.createNewNote(this.inputEl.value, result.brotherTemplate);
            }
          }
        }else{
          new Notice("Create new brother should not work outside [CLUSTERS] folder")
        }
      }
      //-make newCluster to the current active file
      else if (this.createType == "newCluster") {


        const rootChildren = this.app.vault.getRoot().children;
        const ClustersFolder = rootChildren.find((item: any) => item instanceof TFolder && item.name == "[CLUSTERS]");
        // @ts-ignore
        this.setFolder(ClustersFolder, "");
        const clusterName = `${this.inputEl.value}-cluster`;
        this.createNewNote(clusterName, clusterTemplate(clusterName));
      }

      this.close();
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
  private async createDirectory(
    dir: string,
    newDirectoryPath: string
  ): Promise<void> {
    const { vault } = this.app;
    const { adapter } = vault;
    const root = vault.getRoot().path;
    let directoryPath = '';
    if (newDirectoryPath == '') {
      directoryPath = path.join(this.folder.path, dir);
    } else {
      directoryPath = newDirectoryPath;
    }

    const directoryExists = await adapter.exists(directoryPath);

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
  async createNewNote(input: string ,template:string): Promise<void> {
    const { vault } = this.app;
    const { adapter } = vault;
    const prependDirInput = path.join(this.newDirectoryPath, input);
    const { dir, name } = path.parse(prependDirInput);
    const directoryPath = path.join(this.folder.path, dir);

    let filePath = path.join(directoryPath, `${name}.md`);

    try {
      const fileExists = await adapter.exists(filePath);
      if (fileExists) {
        // If the file already exists, respond with error
        throw new Error(`${filePath} already exists`);
      }
      if (dir !== '') {
        //this.createDirectory(dir);
      }
   

        const File = await vault.create(filePath, template);
      
      
      // Create the file and open it in the active leaf
      let leaf = this.app.workspace.getLeaf(false);
      if (this.mode === NewFileLocation.NewPane) {
        //@ts-ignore
        leaf = this.app.workspace.splitLeafOrActive();
      } else if (this.mode === NewFileLocation.NewTab) {
        leaf = this.app.workspace.getLeaf(true);
      } else if (!leaf) {
        // default for active pane
        leaf = this.app.workspace.getLeaf(true);
      }
    await leaf.openFile(File);
   
    } catch (error) {
      new Notice(error.toString());
      console.log(error.toString());
    }
  }
}
