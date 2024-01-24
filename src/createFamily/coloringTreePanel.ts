import { App, TFile } from "obsidian";

const clusters = "CLUSTERS"
const orphans = "ORPHANS"


export async function coloringTreePanel(app: App, file: TFile) {
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

export async function addUnsortedFilesCounter(app: App) {
    this.app = app
    const father: HTMLElement = this.app.workspace.containerEl.querySelector('[draggable="true"][data-path="UN-SORTED"]');
    const unSortedFolderTreeElement = father.querySelector(".tree-item-inner.nav-folder-title-content") as HTMLElement;

    if (unSortedFolderTreeElement) {
        unSortedFolderTreeElement?.addClass("unSortedFolderTreeElement");

        let unSortedFilesNumber = 0;
        this.app.vault.getMarkdownFiles().forEach((item: TFile) => {
            if (item.path.startsWith("UN-SORTED")) {
                unSortedFilesNumber++
            }
        })

        const filesNumberElement = document.createElement('div');
        filesNumberElement.classList.add("unSortedFilesNumber");
        filesNumberElement.innerText = `${unSortedFilesNumber}`;

        if (unSortedFolderTreeElement?.children?.length == 0) {
            unSortedFolderTreeElement?.appendChild(filesNumberElement);
        } else {
            const firstChild = unSortedFolderTreeElement?.children[0];

            unSortedFolderTreeElement?.removeChild(firstChild);
            unSortedFolderTreeElement?.appendChild(filesNumberElement);
        }

    }

}
export async function unSortedObserver(continuaObserving?: boolean) {
    const unSortedFolderTreeElement: HTMLElement = this.app.workspace.containerEl.querySelector('[draggable="true"][data-path="UN-SORTED"]')?.nextElementSibling;

    if (unSortedFolderTreeElement && unSortedFolderTreeElement.className.contains("tree-item-children")) {
        // Create a new MutationObserver with a callback function
        const observer = new MutationObserver((mutations) => {
            // Check if the number of child nodes has changed
            if (mutations[0].type === 'childList') {
                addUnsortedFilesCounter(this.app)
            }
        });

        // Define the type of mutations to observe
        const config = { childList: true };

        // Start observing the target element
        observer.observe(unSortedFolderTreeElement, config);

        if (continuaObserving === false) {
            // stop observing the target element
            observer.disconnect();
        }
    }


}
