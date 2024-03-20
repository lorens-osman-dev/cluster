import { App, Notice, Modal, TFolder, TFile, setIcon } from "obsidian";
import { NewFileLocation } from "../util/enums";
import svgElements from "./svg";



export default class deleteActiveNoteModal extends Modal {
  mode: NewFileLocation;
  inputEl: HTMLInputElement;
  inputListener: any;
  createType: string;

  constructor(app: App, mode: NewFileLocation, createType: string) {
    super(app);
    this.createType = createType;
    this.mode = mode;

    //-Create input
    const getActiveFile = this.app.workspace.getActiveFile();

    this.inputEl = document.createElement("input");
    this.inputEl.type = "text";
    this.inputEl.addClasses(["prompt-input", "inputDelete"])

    //-Delete message 
    const theRelatedSonsFolder = getActiveFile?.parent?.children?.find((item: any) => {
      //normale note
      if (item instanceof TFolder && item.name == getActiveFile.basename) {
        return item
      }
      // cluster
      if (item instanceof TFolder && getActiveFile?.basename?.endsWith("cluster") && item.name == getActiveFile.basename) {
        return item
      }
    })
    const text = document.createElement('div');
    text.addClass("delMsg")
    if (theRelatedSonsFolder) {
      text.appendChild(this.createDeleteMsg1(getActiveFile, theRelatedSonsFolder))
    } else {
      text.appendChild(this.createDeleteMsg2(getActiveFile))
    }
    //-Make modal
    this.modalEl.className = "prompt";

    //svg
    if (this.createType == "deleteNote") {
      this.modalEl.appendChild(svgElements().delete());
    }

    this.modalEl.appendChild(text);
    this.modalEl.appendChild(this.inputEl);

    //#region Buttons
    // ok button ✓
    const okBtn = document.createElement('div');
    setIcon(okBtn, "check")
    okBtn.classList.add("btn", "ok");
    okBtn.addEventListener("click", () => {
      this.doWork()
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

  async doWork() {

    // get current active file
    const getActiveFile = this.app.workspace.getActiveFile();


    //parent folder info 
    const theContainingFolder = getActiveFile!.parent!
    const theContainingFolderItemsNumber = getActiveFile!.parent!.children.length
    const theContainingFolderPath = getActiveFile!.parent!.path
    //Related Sons Folder
    const theRelatedSonsFolder = getActiveFile!.parent!.children.find((item: any) => {
      // normal note
      if (item instanceof TFolder && item.name == getActiveFile!.basename) {
        return item
      }
      // cluster
      if (item instanceof TFolder && getActiveFile?.basename?.endsWith("cluster") && item.name == getActiveFile.basename) {
        return item
      }
    })

    if (theRelatedSonsFolder) {
      //delete current active file + delete its Sons

      await this.app.vault.trash(getActiveFile!, true)
      await this.app.vault.trash(theRelatedSonsFolder, true)
      if (theContainingFolderItemsNumber == 2) {
        await this.app.vault.trash(theContainingFolder, true)
      }
    } else {
      //delete current active file
      await this.app.vault.trash(getActiveFile!, true)

    }

    //delete parent folder of active file if it is empty
    if (theContainingFolderItemsNumber == 1) {
      await this.app.vault.trash(theContainingFolder, true)
    }
  }

  async listenInput(evt: KeyboardEvent) {
    if (evt.key === "Enter") {
      // prevent enter after note creation
      evt.preventDefault();
      await this.doWork()
      this.close();
    }
  }
  createDeleteMsg1(activeFile: any, theRelatedSonsFolder: any) {
    // Create the container element
    const deleteMsgContainer = document.createElement('div');

    // Create and append child elements
    const text1 = document.createElement('span');
    text1.textContent = 'Delete ';
    deleteMsgContainer.appendChild(text1);

    const delNoteNameMsg1 = document.createElement('span');
    delNoteNameMsg1.classList.add('delNoteNameMsg');
    delNoteNameMsg1.textContent = activeFile.basename;
    deleteMsgContainer.appendChild(delNoteNameMsg1);

    const text2 = document.createElement('span');
    text2.textContent = activeFile.basename.endsWith("-cluster") ? ' cluster' : ' note';
    deleteMsgContainer.appendChild(text2);

    const lineBreak = document.createElement('br');
    deleteMsgContainer.appendChild(lineBreak);

    const text3 = document.createElement('span');
    text3.textContent = 'along with its [';
    deleteMsgContainer.appendChild(text3);

    const delNoteNameMsg2 = document.createElement('span');
    delNoteNameMsg2.classList.add('delNoteNameMsg');
    delNoteNameMsg2.textContent = `${theRelatedSonsFolder.children.length}`;
    deleteMsgContainer.appendChild(delNoteNameMsg2);

    const text4 = document.createElement('span');
    text4.textContent = '] direct sons in [' + activeFile.basename + '] folder';
    deleteMsgContainer.appendChild(text4);

    return deleteMsgContainer

  }
  createDeleteMsg2(activeFile: any) {
    // Create the container element
    const deleteMsgContainer = document.createElement('div');

    // Create and append child elements
    const text1 = document.createElement('span');
    text1.textContent = 'Delete current ';
    deleteMsgContainer.appendChild(text1);

    const delNoteNameMsg1 = document.createElement('span');
    delNoteNameMsg1.classList.add('delNoteNameMsg');
    delNoteNameMsg1.textContent = activeFile.basename;
    deleteMsgContainer.appendChild(delNoteNameMsg1);

    const text2 = document.createElement('span');
    text2.textContent = activeFile.basename.endsWith("-cluster") ? ' cluster' : ' note';
    deleteMsgContainer.appendChild(text2);

    return deleteMsgContainer

  }
  onOpen() {
    this.inputEl.focus();
    this.inputEl.addEventListener("keydown", this.inputListener);
  }

  onClose() {
    this.inputEl.removeEventListener("keydown", this.inputListener);
  }
}
