import { App, TFile } from "obsidian";

const clusters = "CLUSTERS"
const orphans = "ORPHANS"


export async function coloringTreePanel(app: App ,file : TFile) {
    this.app = app
    //- Coloring Tree panel
    let clustersFolderTreeElement: any = ""
    let orphansFolderTreeElement: any = ""

    //folders
    const folderTree: Element[] = [];
    const xNavFolder = Array.from(this.app.workspace.containerEl.querySelectorAll(".tree-item.nav-folder"));
    const xInner = Array.from(this.app.workspace.containerEl.querySelectorAll(".tree-item-inner"));
    //@ts-ignore
    folderTree.push(...xNavFolder, ...xInner);
    folderTree.forEach((element: HTMLElement) => {

        //c lusters Folder
        if (element.textContent == clusters) {
            clustersFolderTreeElement = element
        }
        // orphans Folder
        if (element.textContent == orphans) {
            orphansFolderTreeElement = element
        }
    })
    //files 
    const filesTreeTitles: Element[] = Array.from(this.app.workspace.containerEl.querySelectorAll(".nav-file-title-content"));
     //! coloring clusters files titles
    const clustersFilesTreeTitles = filesTreeTitles.filter((element: HTMLElement) => element.textContent?.endsWith("-cluster"))

    // COLORING 
    if (file instanceof TFile) {

        //Coloring clusters tree items
        if (file.path.startsWith(clusters)) {
            clustersFolderTreeElement?.addClass("clustersFolderTreeElement");
            //! coloring clusters files titles
            //clustersFilesTreeTitles.forEach((element: HTMLElement)=> element?.addClass("clustersFilesTreeElementTitles") )

        } else {
            clustersFolderTreeElement?.classList?.remove("clustersFolderTreeElement");
             //! coloring clusters files titles
            //clustersFilesTreeTitles.forEach((element: HTMLElement)=> element?.classList?.remove("clustersFilesTreeElementTitles")) 
        }
        //Coloring orphans tree items
        if (file.path.startsWith(orphans)) {
            orphansFolderTreeElement?.addClass("orphansFolderTreeElement");
        } else {
            orphansFolderTreeElement?.classList?.remove("orphansFolderTreeElement");
        }

    } else {
        clustersFolderTreeElement?.classList?.remove("clustersFolderTreeElement");
        orphansFolderTreeElement?.classList?.remove("orphansFolderTreeElement");
        //! coloring clusters files titles
        //clustersFilesTreeTitles.forEach((element: HTMLElement)=> element?.classList?.remove("clustersFilesTreeElementTitles")) 
        //console.log("clusterPlugin ⸦ this.registerEvent ⸦ clustersFilesTreeTitles:", clustersFilesTreeTitles);
    }
}

export async function coloringUnsortedFolder(app: App ) {
    this.app = app

    let unSortedFolderTreeElement: HTMLElement | null = null

    //folders
    const folderTree: Element[] = [];
    const xNavFolder = Array.from(this.app.workspace.containerEl.querySelectorAll(".tree-item.nav-folder"));
    const xInner = Array.from(this.app.workspace.containerEl.querySelectorAll(".tree-item-inner"));
    //@ts-ignore
    folderTree.push(...xNavFolder, ...xInner);
    folderTree.forEach((element: HTMLElement) => {
        //console.log(element.textContent)
        // UN-SORTED Folder
        if (element.textContent?.startsWith("UN-SORTED") ) {
            unSortedFolderTreeElement = element
        }
    })
    
    if(unSortedFolderTreeElement){
        (unSortedFolderTreeElement as HTMLElement)?.addClass("unSortedFolderTreeElement");

        let unSortedFilesNumber = 0 ;
        this.app.vault.getMarkdownFiles().forEach((item: TFile) =>  {
            if(item.path.startsWith("UN-SORTED")){
                unSortedFilesNumber++
            }
        })

        const filesNumberElement = document.createElement('div');
        filesNumberElement.classList.add("FilesNumber");
        filesNumberElement.innerText = `${unSortedFilesNumber}`;
  
        if( (unSortedFolderTreeElement as HTMLElement)?.children?.length == 0){
            (unSortedFolderTreeElement as HTMLElement)?.appendChild(filesNumberElement);
        }else{
            const firstChild = (unSortedFolderTreeElement as HTMLElement)?.children[0];

            (unSortedFolderTreeElement as HTMLElement)?.removeChild(firstChild);
            (unSortedFolderTreeElement as HTMLElement)?.appendChild(filesNumberElement);
        }
        
    }
       
}
