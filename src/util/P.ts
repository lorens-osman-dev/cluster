import { App } from "obsidian";
import { fileMenu } from "src/mainParts/fileMenu";
import { addCommands } from "src/mainParts/addCommands";
import { addEvents } from "src/mainParts/events";
import { addRibbonIcon } from "src/mainParts/addRibbonIcon";
import { newNavTreeStart } from "src/navtree/naveTree";

import SimpleFocusClass from "src/focus/simpleFocus";
const SimpleFocus = new SimpleFocusClass();

import { buttonsLine, cardStyleFunction } from "../createFamily/buttons";
import {
  coloringTreePanel,
  addUnsortedFilesCounter,
  unSortedObserver,
  foldPropertiesElement,
} from "../createFamily/coloringTreePanel";

// unsorted
function unsortedFiles(appInstance: App) {
  setTimeout(async () => {
    await addUnsortedFilesCounter(appInstance);
    await unSortedObserver(appInstance);
  }, 1000);
}
const P = {
  fileMenu,
  addEvents,
  addCommands,
  addRibbonIcon,
  SimpleFocus,
  buttonsLine,
  cardStyleFunction,
  coloringTreePanel,
  unsorted: {
    unsortedFiles,
    addUnsortedFilesCounter,
    unSortedObserver,
  },
  foldPropertiesElement,
  newNavTreeStart,
};

export default P;
