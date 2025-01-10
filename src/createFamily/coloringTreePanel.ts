import { App, TFile } from "obsidian";

const clusters = "CLUSTERS"
const orphans = "ORPHANS"

//- Fold Properties element
export async function foldPropertiesElement(appObject: App, file: TFile) {
    if (file.path.startsWith(clusters) || file.path.startsWith(orphans)) {
        //FIX try to use toggle class instead of add/remove
        //@ts-ignore
        const propertiesElement: HTMLElement = appObject.workspace.activeEditor?.containerEl.querySelector('.metadata-container');
        const metaDataContentElement = propertiesElement.querySelector('.collapse-indicator') as HTMLElement;
        const collapseIndicatorElement = propertiesElement.querySelector('.metadata-properties-heading') as HTMLElement;
        if (propertiesElement) {
            propertiesElement.classList.add("collapse-from-cluster")
            metaDataContentElement.classList.add("is-collapsed")
            collapseIndicatorElement.classList.add("is-collapsed")
            metaDataContentElement.addEventListener("click", () => {
                propertiesElement.classList.remove("collapse-from-cluster")
            })
            propertiesElement.addEventListener("click", () => {
                propertiesElement.classList.remove("collapse-from-cluster")
            })
        }

    }


}

//- Coloring Tree Panel Elements
export async function coloringTreePanel(appObject: App, file: TFile) {
    // FIX if the file tree is expanded too much , the errors show from this function even its stops the next functions , for this reason i moved the fold function to top
    // Coloring clusters tree Element
    const fatherClusters: HTMLElement = appObject.workspace.containerEl.querySelector('[draggable="true"][data-path="CLUSTERS"]') as HTMLElement;
    const clustersFolderTreeElement = fatherClusters?.querySelector(".tree-item-inner.nav-folder-title-content") as HTMLElement;
    if (file instanceof TFile && fatherClusters && clustersFolderTreeElement) {
        if (file.path.startsWith(clusters)) {
            clustersFolderTreeElement?.addClass("clustersFolderTreeElement");

        } else {
            clustersFolderTreeElement?.classList?.remove("clustersFolderTreeElement");
        }
    } else {
        clustersFolderTreeElement?.classList?.remove("clustersFolderTreeElement");
    }

    // Coloring orphans tree Element
    const fatherOrphans: HTMLElement = appObject.workspace.containerEl.querySelector('[draggable="true"][data-path="ORPHANS"]') as HTMLElement;
    const orphansFolderTreeElement = fatherOrphans?.querySelector(".tree-item-inner.nav-folder-title-content") as HTMLElement;
    if (file instanceof TFile && fatherOrphans && orphansFolderTreeElement) {
        if (file.path.startsWith(orphans)) {
            orphansFolderTreeElement?.addClass("orphansFolderTreeElement");
        } else {
            orphansFolderTreeElement?.classList?.remove("orphansFolderTreeElement");
        }
    } else {
        orphansFolderTreeElement?.classList?.remove("orphansFolderTreeElement");
    }
}


//- Append Unsorted Files Counter Element Function
export async function addUnsortedFilesCounter(appObject: App) {
    const father: HTMLElement = appObject.workspace.containerEl.querySelector('[draggable="true"][data-path="UN-SORTED"]') as HTMLElement;
    const unSortedFolderTreeElement = father?.querySelector(".tree-item-inner.nav-folder-title-content") as HTMLElement;

    if (unSortedFolderTreeElement) {
        unSortedFolderTreeElement?.addClass("unSortedFolderTreeElement");

        let unSortedFilesNumber = 0;
        appObject.vault.getMarkdownFiles().forEach((item: TFile) => {
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
//- Unsorted Files Observer 
export async function unSortedObserver(appObject: App, continuaObserving?: boolean) {
    const unSortedFolderTreeElement: HTMLElement = appObject.workspace.containerEl.querySelector('[draggable="true"][data-path="UN-SORTED"]')?.nextElementSibling as HTMLElement;

    if (unSortedFolderTreeElement && unSortedFolderTreeElement.className.contains("tree-item-children")) {
        // Create a new MutationObserver with a callback function
        const observer = new MutationObserver((mutations) => {
            // Check if the number of child nodes has changed
            if (mutations[0].type === 'childList') {
                addUnsortedFilesCounter(appObject)
            }
        });
        // Define the type of mutations to observe
        const config = { childList: true, subtree: true };

        // Start observing the target element
        observer.observe(unSortedFolderTreeElement, config);

        if (continuaObserving === false) {
            // stop observing the target element
            observer.disconnect();
        }
    }


}
