import { TFile, View, WorkspaceLeaf, TAbstractFile, TFolder } from 'obsidian';

declare module 'obsidian' {
  interface Workspace {
    getLeavesOfType(viewType: 'search' | 'file-explorer'): ExplorerLeaf[];
  }

  interface TAbstractFile {
    extension?: string;
  }
  interface Workspace extends Events {
    on(name: 'deleteToMove', callback: (data: TAbstractFile) => any, ctx?: any): EventRef;
    trigger(name: 'deleteToMove', ...data: [TAbstractFile]): void;
  }
  interface App {
    commands: {
      // Command storage objects
      commands: Record<string, any>;
      editorCommands: Record<string, any>;

      // Methods
      addCommand: (command: any) => void;
      executeCommand: (command: any, context?: any) => boolean;
      executeCommandById: (id: string, context?: any) => boolean;
      findCommand: (id: string) => any | null;
      listCommands: () => any[];
      removeCommand: (id: string) => void;
    }
  }
}

interface ExplorerLeaf extends WorkspaceLeaf {
  view: ExplorerView;
}

interface DomChild {
  file: TFile;
  collapseEl: HTMLElement;
  containerEl: HTMLElement;
}

interface ExplorerView extends View {
  fileItems: Record<string, FileItem>; // keyed by path
  ready: boolean; // true if fileItems is populated
  dom: { children: DomChild[]; changed: () => void };
}

interface FileItem {
  el: HTMLElement;
  file: TAbstractFile;
  titleEl: HTMLDivElement;
  titleInnerEl: HTMLDivElement;
  innerEl: HTMLDivElement;
  selfEl: HTMLDivElement;
  collapseEl: HTMLDivElement
}


export type ElementsObj = {
  files: FileItem[],
  folders: FileItem[],
  oldToMoveElements: FileItem[]
}
export type Pair = {
  file: FileItem,
  folder: FileItem
}
export type Pairs = Pair[]

export type RenamedItem<T extends TAbstractFile> = {
  file: T;
  oldPath: string;
  newPath: string;
  oldParent: string;
  newParent: string
};

export type RenamedItemTFile = RenamedItem<TFile>;
export type RenamedItemTFolder = RenamedItem<TFolder>;

type FileType = "file" | "folder";

type FileStatus = "alone" | "hasChildren";
type IsCluster = "theCluster" | "notTheCluster";

type FolderType = "theCluster" | "notTheCluster";//cluster means the folder generation is 0 

type FolderClusteringState = "linked" | "unLinked"

export type RenamedFileItemType =
  | `${"file"}:${FileStatus}:${IsCluster}`
  | `${"folder"}:${FolderType}:${FolderClusteringState}`;

