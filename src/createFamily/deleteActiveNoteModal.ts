import { App, Notice, Modal, TFolder } from "obsidian";
import { NewFileLocation } from "../util/enums";
import svgElements from "./svg";



export default class deleteActiveNoteModal extends Modal {
  mode: NewFileLocation;
  inputEl: HTMLInputElement;
  inputListener: EventListener;
  createType: string;
  deleteMsg:string
  constructor(app: App, mode: NewFileLocation, createType: string) {
    super(app);
    this.createType = createType;
    this.mode = mode;

    //-Create input
    const getActiveFile = app.workspace.getActiveFile();
   
    this.inputEl = document.createElement("input");
    this.inputEl.type = "text";
    this.inputEl.addClasses(["prompt-input","inputDelete"])
    
    //-Delete message 
    const theRelatedSonsFolder = getActiveFile.parent.children.find((item : any ) => {
      if(item instanceof TFolder && item.name == getActiveFile.basename.toUpperCase() ){
        return item
      }
    })
  
    if(theRelatedSonsFolder){
        //@ts-ignore
      this.deleteMsg =`<span>Press enter ↵ to delete current <span class="delNoteNameMsg">${getActiveFile.basename}</span> note</br>with its related [<span class="delNoteNameMsg">${theRelatedSonsFolder.children.length}</span>] sons in [${getActiveFile.basename.toUpperCase()}] folder</br>or ESC to dismiss.</span>`
    }else{
      this.deleteMsg = `<span>Press enter ↵ to delete current <span class="delNoteNameMsg">${getActiveFile.basename}</span> note or ESC to dismiss.</span>`
    }
    //-Make modal
    this.modalEl.className = "prompt";
    this.modalEl.innerHTML = "";
    //svg
    if (this.createType == "deleteNote") {
      this.modalEl.appendChild(svgElements().delete());
    }
    //txt msg
    const text = document.createElement('div');
    text.innerHTML = this.deleteMsg
    text.addClass("delMsg")


    this.modalEl.appendChild(text);
    this.modalEl.appendChild(this.inputEl);

    this.inputListener = this.listenInput.bind(this);
  }

  //! This deleteActiveNoteModal enter point
  async listenInput(evt: KeyboardEvent) {
    if (evt.key === "Enter") {
      // prevent enter after note creation
      evt.preventDefault();

      // get current active file
      const getActiveFile = app.workspace.getActiveFile();
      
      
      //parent folder info 
      const theContainingFolder = getActiveFile.parent.children.length
      const theContainingFolderPath = getActiveFile.parent.path
      //Related Sons Folder
      const theRelatedSonsFolder = getActiveFile.parent.children.find((item : any ) => {
        if(item instanceof TFolder && item.name == getActiveFile.basename.toUpperCase() ){
          return item
        }
      })
      
      if(theRelatedSonsFolder){
        //delete current active file + delete its Sons
        await this.app.vault.adapter.remove(getActiveFile.path)
        await this.app.vault.adapter.rmdir(theRelatedSonsFolder.path , true)
        if(theContainingFolder == 2){
          await this.app.vault.adapter.rmdir(theContainingFolderPath , true)
        }
      }else{
        //delete current active file
        await this.app.vault.adapter.remove(getActiveFile.path)

      }
   
      //delete parent folder of active file if it is empty
      if(theContainingFolder == 1 ){
        await this.app.vault.adapter.rmdir(theContainingFolderPath , true)
        console.log("dddddddddd")
        console.log(theContainingFolder)
      }
      this.close();
    }
  }

  onOpen() {
    this.inputEl.focus();
    this.inputEl.addEventListener("keydown", this.inputListener);
  }

  onClose() {
    this.inputEl.removeEventListener("keydown", this.inputListener);
  }
}
