import { Plugin, TFile} from "obsidian";
import { buttonsLine, cardStyleFunction } from "./src/createFamily/buttons";
import {
	coloringTreePanel,
	addUnsortedFilesCounter,
	unSortedObserver,
	foldPropertiesElement,
} from "./src/createFamily/coloringTreePanel";
import { fileMenu } from "src/mainParts/fileMenu";
import { settingTab } from "./src/createFamily/settings";
import SimpleFocusClass from "src/focus/simpleFocus";
import { addCommands } from "src/mainParts/addCommands";
import { addRibbonIcon } from "src/mainParts/addRibbonIcon";

const SimpleFocus = new SimpleFocusClass();


export interface clusterPluginSettings {
	foldProperties: boolean;

	firstPageClusters: boolean;
	cardStyle: boolean;
	restBgClusters: boolean;
	newBG_clusters: string;
	newBG_orphans: string;
	restBgOrphans: boolean;
	buttonsLineContainerBG_clusters: string;
	buttonsLineContainerBG_orphans: string;
}

const DEFAULT_SETTINGS: Partial<clusterPluginSettings> = {
	foldProperties: true,

	firstPageClusters: true,
	cardStyle: false,
	restBgClusters: true,
	restBgOrphans: true,
	buttonsLineContainerBG_clusters:
		"var(--background-button-container-clusters)",
	buttonsLineContainerBG_orphans: "var(--background-button-container-orphans)",
};

export default class clusterPlugin extends Plugin {
	actions = new Map(); // ! whats this
	settings: clusterPluginSettings;

	async onload() {
		console.log("loading Cluster plugin");

		await this.loadSettings();
		
		this.addSettingTab(new settingTab(this.app, this));

		//- UN-SORTED Folder Styling
		setTimeout(async () => {
			await addUnsortedFilesCounter(this.app);
			await unSortedObserver(this.app);
		}, 1000);
		//- Card style
		await cardStyleFunction( this.settings);

		const file = this.app.workspace.getActiveFile() as TFile;
		if (file) {
			await buttonsLine(this.app, file, this.settings);
		}

		this.registerEvent(
			this.app.workspace.on("file-open", async (file) => {
				if (file) {
					//- Add Buttons
					await buttonsLine(this.app, file, this.settings);

					//- Coloring Tree Panel
					await coloringTreePanel(this.app, file);
					//- Fold Properties Element
					if (this.settings.foldProperties) {
						await foldPropertiesElement(this.app, file);
					}
					await addUnsortedFilesCounter(this.app);
					await unSortedObserver(this.app);
				}
			}),
		);

	
		//- add Ribbon Icon
		addRibbonIcon( this);
		//- File Menu
		fileMenu(this,SimpleFocus);
		//- Commands
		addCommands(this);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onunload() {
		//FIX if there more than one file in workspace you need to remove the buttons line from them all
		// Remove Buttons line
		const file = this.app.workspace.getActiveFile() as TFile;
		await buttonsLine(this.app, file, this.settings, true);
		unSortedObserver(this.app, false);
		console.log("unloading Cluster plugin");
	}
}
