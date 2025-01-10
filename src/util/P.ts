import { fileMenu } from "src/mainParts/fileMenu";
import { addCommands } from "src/mainParts/addCommands";
import { addEvents } from "src/mainParts/events";
import { addRibbonIcon } from "src/mainParts/addRibbonIcon";

import SimpleFocusClass from "src/focus/simpleFocus";
const SimpleFocus = new SimpleFocusClass();

import { buttonsLine, cardStyleFunction } from "../createFamily/buttons";
import {
  coloringTreePanel,
  addUnsortedFilesCounter,
  unSortedObserver,
  foldPropertiesElement,
} from "../createFamily/coloringTreePanel";
const P = {
  fileMenu,
  addEvents,
  addCommands,
  addRibbonIcon,
  SimpleFocus,
  buttonsLine,
  cardStyleFunction,
  coloringTreePanel,
  addUnsortedFilesCounter,
  unSortedObserver,
  foldPropertiesElement,

}

export default P