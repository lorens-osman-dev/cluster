import { TFile, setTooltip, setIcon, addIcon, MarkdownView, Editor, Platform, TFolder, Plugin } from "obsidian";
import familyModal from "./familyModal";
import U from '../util/U';
import deleteActiveNoteModal from "./deleteActiveNoteModal";
import { createClustersAndOrphansFolder } from "./createClustersAndOrphansFolder";
import { puzzleTemplate } from "./templates";
import type { clusterPluginSettings } from "../settings/settings";

const clusters = "CLUSTERS"
const orphans = "ORPHANS"
let Vars = {}
export async function buttonsLine(plugin: Plugin, file: TFile, settings?: clusterPluginSettings, removeButtons?: boolean) {

    Vars = settings as clusterPluginSettings;
    //! Android 
    if (Platform.isMobile) {
        const LEAF = plugin.app.workspace.getActiveViewOfType(MarkdownView)
        if (LEAF !== null) {
            const obsidianContainer = LEAF?.containerEl

            const obsidianContainerElements = Array?.from(obsidianContainer?.children)
            //@ts-ignore
            const obsidianHeaderEl = LEAF?.headerEl
            if (removeButtons) {//remove buttons when on unload
                RemoveButtonsLine(file, obsidianContainer, obsidianContainerElements, obsidianHeaderEl)
            } else {
                appendOrRemoveChild(plugin, file, obsidianContainer, obsidianContainerElements, obsidianHeaderEl)
                firstPageOfClusters(file, obsidianContainerElements)
            }

        }

    }
    //! PC 
    else {
        const activeLeave = plugin.app.workspace.getActiveViewOfType(MarkdownView)
        //@ts-ignore
        const activeLeavePath = activeLeave?.file?.path as string
        if (activeLeavePath.startsWith(clusters) || activeLeavePath.startsWith(orphans)) {
            const obsidianContainer = activeLeave?.containerEl
            //@ts-ignore
            const obsidianContainerElements = Array?.from(obsidianContainer?.children)
            //@ts-ignore
            const obsidianHeaderEl = activeLeave?.headerEl

            if (removeButtons) {//remove buttons when on unload
                RemoveButtonsLine(file, obsidianContainer as HTMLElement, obsidianContainerElements, obsidianHeaderEl)
            } else {
                // append buttonsLineContainer to DOM if the file  in clusters folder or in orphans folder
                appendOrRemoveChild(plugin, file, obsidianContainer as HTMLElement, obsidianContainerElements, obsidianHeaderEl)
                firstPageOfClusters(file, obsidianContainerElements)

            }
        } else {
            const obsidianContainer2 = activeLeave?.containerEl
            //@ts-ignore
            const obsidianContainerElements2 = Array?.from(obsidianContainer2?.children)
            //@ts-ignore
            const obsidianHeaderEl2 = activeLeave?.headerEl
            // remove buttonsLineContainer from DOM if the file not in clusters folder or in orphans folder
            RemoveChild(file, obsidianContainer2 as HTMLElement, obsidianContainerElements2, obsidianHeaderEl2)
            firstPageOfClusters(file, obsidianContainerElements2)

        }
    }

}
function RemoveChild(file: TFile, obsidianContainer: HTMLElement, obsidianContainerElements: Element[], obsidianHeaderEl: HTMLElement) {
    // check if buttonsLineContainer exist in the DOM or not
    const isButtonsLineContainer: Element | undefined = obsidianContainerElements.find((item: HTMLElement) => item.classList.contains("buttonsLineContainer"))

    // remove buttonsLineContainer from DOM if the file not in clusters folder or in orphans folder
    if (isButtonsLineContainer && !(file?.path?.startsWith(orphans) || file?.path?.startsWith(clusters))) {
        obsidianContainer.removeChild(isButtonsLineContainer)
    }
}
// remove buttonsLineContainer on unload
function RemoveButtonsLine(file: TFile, obsidianContainer: HTMLElement, obsidianContainerElements: Element[], obsidianHeaderEl: HTMLElement) {
    // check if buttonsLineContainer exist in the DOM or not
    const isButtonsLineContainer: Element | undefined = obsidianContainerElements.find((item: HTMLElement) => item.classList.contains("buttonsLineContainer"))

    // remove buttonsLineContainer on unload
    if (isButtonsLineContainer && (file?.path?.startsWith(orphans) || file?.path?.startsWith(clusters))) {
        obsidianContainer.removeChild(isButtonsLineContainer)
    }
}
//- Append Or Remove Child FUNCTION
function appendOrRemoveChild(plugin: Plugin, file: TFile, obsidianContainer: HTMLElement, obsidianContainerElements: Element[], obsidianHeaderEl: HTMLElement) {
    // check if buttonsLineContainer exist in the DOM or not
    const isButtonsLineContainer: Element | undefined = obsidianContainerElements.find((item: HTMLElement) => item.classList.contains("buttonsLineContainer"))
    // this duplicate to RemoveChild() but its necessary for mobile users
    // remove buttonsLineContainer from DOM if the file not in clusters folder or in orphans folder
    if (isButtonsLineContainer && !(file?.path?.startsWith(orphans) || file?.path?.startsWith(clusters))) {
        obsidianContainer.removeChild(isButtonsLineContainer)
    }
    // add buttonsLineContainer to DOM if the file in clusters folder or in orphans folder
    if ((file?.path?.startsWith(orphans) || file?.path?.startsWith(clusters))) {
        // If we are within either the CLUSTERS or ORPHANS folder and navigate through the files,
        //   it will generate of multiple buttonsLineContainer element on top of each other. 
        //   To prevent this,delete of additional instances from the first .
        if (isButtonsLineContainer) {
            obsidianContainer.removeChild(isButtonsLineContainer)
        }

        // Create a buttons Containers 
        const buttonsLineContainer = document.createElement('div');
        buttonsLineContainer.addClasses(["buttonsLineContainer"])
        //@ts-ignore
        buttonsLineContainer.style.backgroundColor = Vars.buttonsLineContainerBG_clusters

        // check if the file and folder in same time
        const selfName = file.basename
        const siblings = file.parent?.children
        const isThereChildrenFolder = siblings?.find((item) => item instanceof TFolder && item.name === selfName) as TFolder
        if (isThereChildrenFolder && !file.basename.endsWith("-cluster")) {
            buttonsLineContainer.addClasses(["mergeFileFolder"])
        }
        if (file.basename.endsWith("-cluster")) {
            buttonsLineContainer.addClasses(["mergeFileFolderCluster"])
        }

        const extraButtonsContainer = document.createElement('div');
        extraButtonsContainer.addClasses(["extraButtonsContainer"])
        //@ts-ignore
        extraButtonsContainer.style.backgroundColor = Vars.buttonsLineContainerBG_clusters

        // Making Buttons
        const clusterBtn = makeButton(plugin, "Cluster", "clusterBtn", "Create New Cluster in [CLUSTERS] folder")
        setExternalIcon(clusterBtn, "cluster")

        const childBtn = makeButton(plugin, "Child", "childBtn", `Create Child for current [${file.basename}] note`)
        setIcon(childBtn, "baby")

        const siblingBtn = makeButton(plugin, "Sibling", "siblingBtn", `Create Sibling for current [${file.basename}] note`)
        setIcon(siblingBtn, "git-compare")

        const orphanBtn = makeButton(plugin, "Orphan", "orphanBtn", `Create New Orphan note in [ORPHANS] folder`)
        setIcon(orphanBtn, "disc")

        const deleteBtn = makeButton(plugin, "Delete", "deleteBtn", `Delete the current [${file.basename}] note along with its associated child notes if they exist`)
        setIcon(deleteBtn, "trash-2")

        // Making Extra Buttons
        const extraBtn = makeButton(plugin, "extraBtn", "extraBtn", `Show / Hide extra buttons`, extraButtonsContainer, file)
        setIcon(extraBtn, "chevron-left-square")


        const deleteLineBtn = makeButton(plugin, "deleteLineBtn", "deleteLineBtn", `Delete the current line`)
        setIcon(deleteLineBtn, "chevrons-left")
        const undoBtn = makeButton(plugin, "undoBtn", "undoBtn", `Undo the last action`)
        setIcon(undoBtn, "redo-2")
        const coffeeBtn = makeButton(plugin, "coffeeBtn", "coffeeBtn", `coffee`)
        setIcon(coffeeBtn, "coffee")
        const puzzleBtn = makeButton(plugin, "puzzleBtn", "puzzleBtn", `puzzle tooltip message `)
        setIcon(puzzleBtn, "puzzle")


        // Append Buttons to buttonsLineContainer
        buttonsLineContainer?.appendChild(clusterBtn)
        buttonsLineContainer?.appendChild(childBtn)
        buttonsLineContainer?.appendChild(siblingBtn)
        buttonsLineContainer?.appendChild(orphanBtn)
        buttonsLineContainer?.appendChild(deleteBtn)

        // Append Extra Buttons 
        buttonsLineContainer?.appendChild(extraBtn)

        extraButtonsContainer?.appendChild(undoBtn)
        extraButtonsContainer?.appendChild(deleteLineBtn)
        extraButtonsContainer?.appendChild(coffeeBtn)
        extraButtonsContainer?.appendChild(puzzleBtn)

        buttonsLineContainer?.appendChild(extraButtonsContainer)

        if (file?.path?.startsWith(orphans)) {
            //@ts-ignore
            buttonsLineContainer.style.backgroundColor = Vars.buttonsLineContainerBG_orphans
            //@ts-ignore
            extraButtonsContainer.style.backgroundColor = Vars.buttonsLineContainerBG_orphans
            buttonsLineContainer?.removeChild(childBtn)
            buttonsLineContainer?.removeChild(siblingBtn)
        }

        // Append the buttonsLineContainer after obsidianHeaderEl 
        obsidianHeaderEl.insertAdjacentElement('afterend', buttonsLineContainer)
    }
}



//- Make Button FUNCTION
function makeButton(plugin: Plugin, type: string, className: string, tooltipMsg: string, element?: HTMLElement, file?: TFile) {
    const button = document.createElement('div');
    button.textContent = type;
    setTooltip(button, tooltipMsg, { delay: 10 })
    button.addClasses(["btn", className])
    button.addEventListener('click', async () => {
        if (type == "Cluster") {
            createClustersAndOrphansFolder(plugin.app);
            new familyModal(plugin, U.NewFileLocation.NewTab, "newCluster", undefined).open();
        }
        else if (type == "Child") {
            createClustersAndOrphansFolder(plugin.app);
            new familyModal(plugin, U.NewFileLocation.NewTab, "newChild", undefined).open()
        }
        else if (type == "Sibling") {
            createClustersAndOrphansFolder(plugin.app);
            new familyModal(plugin, U.NewFileLocation.NewTab, "newSibling", undefined).open();
        }
        else if (type == "Orphan") {
            createClustersAndOrphansFolder(plugin.app);
            new familyModal(plugin, U.NewFileLocation.NewTab, "newOrphan", undefined).open();
        }
        else if (type == "Delete") {
            createClustersAndOrphansFolder(plugin.app);
            new deleteActiveNoteModal(plugin.app, U.NewFileLocation.NewTab, "deleteNote").open();
        }
        // Extra Buttons
        else if (type == "extraBtn") {
            button.classList.toggle("rotate-90-cw")
            if (file?.path?.startsWith(clusters)) {
                element?.classList?.toggle("showOnClusters")
            }
            if (file?.path?.startsWith(orphans)) {
                element?.classList?.toggle("showOnOrphans")
            }
        }
        else if (type == "deleteLineBtn") {
            const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
            const editor = view?.editor as Editor
            editor.exec("deleteLine")
            editor.focus()
        }
        else if (type == "undoBtn") {
            const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
            const editor = view?.editor as Editor
            editor.undo()
            editor.focus()
        }
        else if (type == "coffeeBtn") {
            const coffeeLink = "https://www.buymeacoffee.com/lorens";
            window.location.href = coffeeLink;
        }
        else if (type == "puzzleBtn") {
            const puzzleFileExists = plugin.app.vault.getAbstractFileByPath("ORPHANS/puzzle.md")
            if (puzzleFileExists === null) {
                const puzzleFile = await plugin.app.vault.create("/ORPHANS/puzzle.md", puzzleTemplate)
                plugin.app.workspace.getLeaf(true).openFile(puzzleFile);
            }
        }



    });
    return button
}

//- Set Cluster Icon FUNCTION
function setExternalIcon(con: HTMLElement, type: string) {

    if (type == "cluster") {

        addIcon("cluster-svg", `<g clip-path="url(#clip0_2_2)">
        <path d="M87.4883 74.9859C85.1634 75.0547 83.0136 75.7421 81.1887 76.8918L67.3645 63.4256C70.0769 60.0075 71.7893 55.6833 71.9892 50.9717L81.8011 49.9906C83.2073 53.465 86.5508 55.8708 90.4568 55.8708C95.6003 55.8708 99.7688 51.7028 99.7688 46.56C99.7688 41.4172 95.6003 37.2493 90.4568 37.2493C85.7759 37.2493 81.9074 40.6986 81.2449 45.1915L71.3018 45.9914C69.9019 38.8927 65.2209 33.1188 58.9401 30.2381L60.8649 24.9953H62.4898C69.3582 24.9453 74.9016 19.3714 74.9016 12.4977C74.9016 5.5927 69.3082 0 62.4023 0C55.4965 0 49.9031 5.5927 49.9031 12.4977C49.9031 17.1343 52.428 21.1835 56.1777 23.3394L54.4903 28.6821C53.0717 28.3447 51.4468 28.1572 49.7781 28.1572C44.591 28.1572 39.8413 30.0069 36.1477 33.0875L17.4364 14.3161C18.3176 12.9163 18.8426 11.2104 18.8426 9.37949C18.8426 4.20546 14.6428 0.00624883 9.46816 0.00624883C4.29348 0.00624883 0.0937441 4.20546 0.0937441 9.37949C0.0937441 14.5223 4.23723 18.7027 9.36816 18.7527C11.1243 18.7465 12.768 18.2591 14.1616 17.4155L32.8667 36.187C29.9044 39.8613 28.117 44.5854 28.117 49.7344C28.117 49.8282 28.117 49.9219 28.117 50.0156C28.117 50.3781 28.117 50.6905 28.117 51.0029L23.9922 51.6903C22.0361 47.1912 17.6239 44.1042 12.4992 44.1042C5.5934 44.1042 0 49.6969 0 56.6019C0 63.5068 5.5934 69.0995 12.4992 69.0995C19.405 69.0995 24.9984 63.5068 24.9984 56.6019C24.9984 56.4769 24.9984 56.3582 24.9922 56.2332L28.9294 55.6271C30.4418 60.8948 33.7291 65.2378 38.0914 68.0747L34.6166 75.4983C33.6104 75.1922 32.448 75.0109 31.248 74.9984C31.2105 74.9984 31.1731 74.9984 31.1418 74.9984C24.236 74.9984 18.6426 80.5911 18.6426 87.4961C18.6426 94.4011 24.236 99.9938 31.1418 99.9938C38.0476 99.9938 43.641 94.4011 43.641 87.4961C43.641 83.4968 41.7599 79.9288 38.8351 77.6417L42.3724 70.4368C44.6472 71.3491 47.2908 71.8803 50.0531 71.8803C55.3465 71.8803 60.1837 69.9369 63.9022 66.7312L77.5014 80.0038C75.939 82.0659 75.0016 84.6779 75.0016 87.5023C75.0016 94.4073 80.595 100 87.5008 100C94.4066 100 100 94.4073 100 87.5023C100 80.5974 94.4066 75.0047 87.5008 75.0047L87.4883 74.9859ZM31.2418 93.7324C27.792 93.7324 24.9922 90.933 24.9922 87.4836C24.9922 84.0342 27.792 81.2348 31.2418 81.2348C34.6916 81.2348 37.4914 84.0342 37.4914 87.4836C37.4914 90.933 34.6916 93.7324 31.2418 93.7324ZM49.9906 65.6127C41.3599 65.6127 34.3666 58.6203 34.3666 49.9906C34.3666 41.361 41.3599 34.3686 49.9906 34.3686C58.6213 34.3686 65.6146 41.361 65.6146 49.9906C65.6146 58.6203 58.6213 65.6127 49.9906 65.6127Z" />
        </g>
        <defs>
        <clipPath id="clip0_2_2">
        <rect width="100" height="100" fill="white"/>
        </clipPath>
        </defs>`);

        setIcon(con, "cluster-svg")
        return
    }
}

//- First Page Of Clusters FUNCTION
function firstPageOfClusters(file: TFile, obsidianContainerElements: Element[]) {


    const viewContentElement = obsidianContainerElements.find((item: HTMLElement) => item.classList.contains("view-content")) as HTMLElement
    //@ts-ignore
    if (file instanceof TFile && file.path.startsWith(clusters) && file.basename.endsWith("-cluster") && Vars.firstPageClusters) {
        if (viewContentElement) {
            viewContentElement.classList.add("viewContentElementBG")
        }
    } else {
        if (viewContentElement) {
            viewContentElement.classList.remove("viewContentElementBG")
        }
    }

}

export async function cardStyleFunction(settings: clusterPluginSettings) {
    setTimeout(() => {

        const appContainer = document.body
        const classList = Array.from(appContainer.classList)
        const isDark = classList.find((className: string) => className === "theme-dark")


        if (settings.cardStyle) {
            if (isDark) {

                appContainer.classList.add("card-layout-open-dark")
            }
            appContainer.classList.add("card-layout-open-light")
        } else {
            appContainer.classList.remove("card-layout-open-dark")
            appContainer.classList.remove("card-layout-open-light")
        }
    }, 500);
}