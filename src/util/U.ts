import { Notice } from "obsidian";
import IF from "./bigIF";

export enum NewFileLocation {
  CurrentPane = 'current-pane',
  NewPane = 'new-pane',
  NewTab = 'new-tab',
}

function createErrorMessage(source: string, message: string): void {
  const errorMessage = `Error in ${source}: ${message}`;
  new Notice(errorMessage, 10000);
  console.warn(errorMessage);
}
const U = {
  IF, NewFileLocation, createErrorMessage
};

export default U;
