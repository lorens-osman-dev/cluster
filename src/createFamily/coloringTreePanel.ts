import { App, TFile } from "obsidian";

const clusters = "CLUSTERS"
const orphans = "ORPHANS"


//- Coloring Tree Panel Elements
export async function coloringTreePanel(app: App, file: TFile) {
    this.app = app
    // Coloring clusters tree Element
    const fatherClusters: HTMLElement = this.app.workspace.containerEl.querySelector('[draggable="true"][data-path="CLUSTERS"]');
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
    const fatherOrphans: HTMLElement = this.app.workspace.containerEl.querySelector('[draggable="true"][data-path="ORPHANS"]');
    const orphansFolderTreeElement = fatherOrphans.querySelector(".tree-item-inner.nav-folder-title-content") as HTMLElement;
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

//- Fold Properties element
export async function foldPropertiesElement(app: App, file: TFile) {
    if (file.path.startsWith(clusters) || file.path.startsWith(orphans)) {

        this.app = app
        const propertiesElement: HTMLElement = this.app.workspace.activeEditor.containerEl.querySelector('.metadata-container');
        const metaDataContentElement = propertiesElement.querySelector('.collapse-indicator') as HTMLElement;
        const collapseIndicatorElement = propertiesElement.querySelector('.metadata-properties-heading') as HTMLElement;
        if (propertiesElement) {
            propertiesElement.classList.add("collapse-from-cluster")
            metaDataContentElement.classList.add("is-collapsed")
            collapseIndicatorElement.classList.add("is-collapsed")
            metaDataContentElement.addEventListener("click", () => {
                propertiesElement.classList.remove("collapse-from-cluster")
            })
        }

    }


}
//- Append Unsorted Files Counter Element Function
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
//- Unsorted Files Observer 
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
