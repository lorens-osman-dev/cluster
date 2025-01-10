import { Plugin, TFile} from "obsidian";
import P from "src/util/P";
import { settingTab ,DEFAULT_SETTINGS ,clusterPluginSettings } from "./src/settings/settings";


export default class clusterPlugin extends Plugin {
	settings: clusterPluginSettings;

	async onload() {
		console.log("loading Cluster plugin");

		await this.loadSettings();
		this.addSettingTab(new settingTab(this.app, this));

		// UN-SORTED Folder Styling
		setTimeout(async () => {
			await P.addUnsortedFilesCounter(this.app);
			await P.unSortedObserver(this.app);
		}, 1000);

		
		const file = this.app.workspace.getActiveFile() as TFile;
		if (file) {
			await P.buttonsLine(this.app, file, this.settings);
		}
		P.addEvents(this)
		P.addRibbonIcon( this);
		P.fileMenu(this,P.SimpleFocus);
		P.addCommands(this);
		
		await P.cardStyleFunction( this.settings);//card style for lorens theme
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
		await P.buttonsLine(this.app, file, this.settings, true);
		P.unSortedObserver(this.app, false);
		console.log("unloading Cluster plugin");
	}
}
