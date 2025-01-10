import clusterPlugin from "../../main";
import {
	App,
	PluginSettingTab,
	Setting,
	TextComponent,
	ToggleComponent,
	Platform,
} from "obsidian";


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

export const DEFAULT_SETTINGS: Partial<clusterPluginSettings> = {
	foldProperties: true,

	firstPageClusters: true,
	cardStyle: false,
	restBgClusters: true,
	restBgOrphans: true,
	buttonsLineContainerBG_clusters:
		"var(--background-button-container-clusters)",
	buttonsLineContainerBG_orphans: "var(--background-button-container-orphans)",
};

export class settingTab extends PluginSettingTab {
	plugin: clusterPlugin;

	constructor(app: App, plugin: clusterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.classList.add("clusterSettingPage");
		//- HEADER
		new Setting(containerEl)
			.setName("Cluster Plugin Settings")
			.setDesc("Changes apply after app reload or opening a different note.");
		//- Background element
		new Setting(containerEl).setClass("settingsBackground");
		//- Fold Properties
		new Setting(containerEl)
			.setName("Fold Properties")
			.setDesc(
				"Automatically fold the 'Properties' section upon opening notes, This feature Only work inside 'CLUSTERS' and 'ORPHANS' folders.",
			)
			.addToggle((toggle: ToggleComponent) => {
				toggle.setValue(this.plugin.settings.foldProperties);
				toggle.onChange(async (value) => {
					this.plugin.settings.foldProperties = value;
					await this.plugin.saveSettings();
				});
			});

		//- Main Notes (Clusters) Background color
		const firstPOC = new Setting(containerEl);
		firstPOC.setName("Main Notes (Clusters) Background color");
		firstPOC.setDesc(
			"Highlight the main note of each cluster whose name ends with '-cluster' by adding a background color.",
		);
		firstPOC.addToggle((toggle: ToggleComponent) => {
			toggle.setValue(this.plugin.settings.firstPageClusters);
			toggle.onChange(async (value) => {
				this.plugin.settings.firstPageClusters = value;
				await this.plugin.saveSettings();
			});
		});

		//- Card style
		if (Platform.isDesktop) {
			const cardStyle = new Setting(containerEl);
			cardStyle.setName("Card Style");
			cardStyle.setDesc(
				"If you are using 'Lorens' theme on PC this option will add card style .",
			);
			cardStyle.addToggle((toggle: ToggleComponent) => {
				toggle.setValue(this.plugin.settings.cardStyle);
				toggle.onChange(async (value) => {
					this.plugin.settings.cardStyle = value;
					const appContainer = document.body
					const classList = Array.from(appContainer.classList)
					const isDark = classList.find((className: string) => className === "theme-dark")
					if (value) {
						await this.plugin.saveSettings();
						if (isDark) {

							appContainer.classList.add("card-layout-open-dark")
						}
						appContainer.classList.add("card-layout-open-light")
					} else {
						appContainer.classList.remove("card-layout-open-dark")
						appContainer.classList.remove("card-layout-open-light")
						await this.plugin.saveSettings();

					}
				});
			});
		}

		//- Buttons Background Color
		new Setting(containerEl).setName("Buttons Background Color");

		// clusters buttons background color
		this.clusterFun(new Setting(containerEl));
		// Orphans buttons background color
		this.orphanFun(new Setting(containerEl));

		//-GitHub
		new Setting(containerEl)
			.setName("GitHub")
			.setDesc("Report Issues or Ideas, see the Source Code and Contribute.")
			.addButton((button) => {
				button.setIcon("github");
				button.onClick(
					() =>
					(window.location.href =
						"https://github.com/lorens-osman-dev/cluster"),
				);
			});

		//-Donation
		new Setting(containerEl)
			.setName("Make First Dream true")
			.setDesc("If you like this Plugin, Consider making first dream true.")
			.addButton((button) => {
				button.setIcon("coffee");
				button.setClass("coffeeSettingBtn");
				button.onClick(
					() => (window.location.href = "https://www.buymeacoffee.com/lorens"),
				);
			});
	}

	clusterFun(setting: Setting) {
		//-make input with its text
		setting.setClass("color_input");
		setting.setHeading();
		let inputText: TextComponent | null = null;
		const input = setting.addText((text: TextComponent) => {
			inputText = text;
			text.setValue(this.plugin.settings.buttonsLineContainerBG_clusters);
			text.onChange(async (value: string) => {
				text.inputEl.style.backgroundColor = value;
				this.plugin.settings.newBG_clusters = value;
				this.plugin.settings.buttonsLineContainerBG_clusters = value;
				await this.plugin.saveSettings();
			});
		});

		input.controlEl.createEl("div", {
			text: "clusters buttons background color ",
			cls: "inputExtraText clusters",
		});

		//- on load effect
		if (this.plugin.settings.restBgClusters) {
			input.controlEl.classList.add("inputDisable");
			input.controlEl.classList.remove("inputEnable");
			if (inputText !== null) {
				(inputText as TextComponent).inputEl.style.backgroundColor =
					"var(--background-button-container-clusters)";
			}
		} else {
			input.controlEl.classList.add("inputEnable");
			input.controlEl.classList.remove("inputDisable");
			if (inputText !== null) {
				(inputText as TextComponent).inputEl.style.backgroundColor =
					this.plugin.settings.newBG_clusters;
			}
		}
		//-make toggle with its text
		setting.addToggle((toggle: ToggleComponent) => {
			toggle.toggleEl.classList.add("customToggle");
			toggle.toggleEl.createEl("div", {
				text: "Default value",
				cls: "toggleExtraText",
			}); //extra text
			toggle.setValue(this.plugin.settings.restBgClusters);
			toggle.onChange(async (value) => {
				if (value === true) {
					this.plugin.settings.restBgClusters = true;
					this.plugin.settings.buttonsLineContainerBG_clusters =
						"var(--background-button-container-clusters)";
					inputText?.setValue("var(--background-button-container-clusters)");
					inputText!.inputEl.style.backgroundColor =
						"var(--background-button-container-clusters)";
					input.controlEl.classList.add("inputDisable");
					input.controlEl.classList.remove("inputEnable");
				} else {
					input.controlEl.classList.add("inputEnable");
					input.controlEl.classList.remove("inputDisable");

					this.plugin.settings.restBgClusters = false;
					this.plugin.settings.buttonsLineContainerBG_clusters =
						this.plugin.settings.newBG_clusters;
					inputText!.setValue(this.plugin.settings.newBG_clusters);
					inputText!.inputEl.style.backgroundColor =
						this.plugin.settings.newBG_clusters;
				}
				await this.plugin.saveSettings();
			});
		});
	}
	orphanFun(setting: Setting) {
		//-make input with its text
		setting.setClass("color_input");
		setting.setHeading();
		let inputText: TextComponent | null = null;
		const input = setting.addText((text: TextComponent) => {
			inputText = text;
			text.setValue(this.plugin.settings.buttonsLineContainerBG_orphans);
			text.onChange(async (value: string) => {
				text.inputEl.style.backgroundColor = value;
				this.plugin.settings.newBG_orphans = value;
				this.plugin.settings.buttonsLineContainerBG_orphans = value;
				await this.plugin.saveSettings();
			});
		});
		input.controlEl.createEl("div", {
			text: "orphans buttons background color ",
			cls: "inputExtraText orphans",
		});

		//- on load effect
		if (this.plugin.settings.restBgOrphans) {
			input.controlEl.classList.add("inputDisable");
			input.controlEl.classList.remove("inputEnable");
			if (inputText !== null) {
				(inputText as TextComponent).inputEl.style.backgroundColor =
					"var(--background-button-container-orphans)";
			}
		} else {
			input.controlEl.classList.add("inputEnable");
			input.controlEl.classList.remove("inputDisable");
			if (inputText !== null) {
				(inputText as TextComponent).inputEl.style.backgroundColor =
					this.plugin.settings.newBG_orphans;
			}
		}
		//-make toggle with its text
		setting.addToggle((toggle: ToggleComponent) => {
			toggle.toggleEl.classList.add("customToggle");
			toggle.toggleEl.createEl("div", {
				text: "Default value",
				cls: "toggleExtraText",
			}); //extra text
			toggle.setValue(this.plugin.settings.restBgOrphans);
			toggle.onChange(async (value) => {
				if (value === true) {
					this.plugin.settings.restBgOrphans = true;
					this.plugin.settings.buttonsLineContainerBG_orphans =
						"var(--background-button-container-orphans)";
					inputText?.setValue("var(--background-button-container-orphans)");
					inputText!.inputEl.style.backgroundColor =
						"var(--background-button-container-orphans)";
					input.controlEl.classList.add("inputDisable");
					input.controlEl.classList.remove("inputEnable");
				} else {
					input.controlEl.classList.add("inputEnable");
					input.controlEl.classList.remove("inputDisable");

					this.plugin.settings.restBgOrphans = false;
					this.plugin.settings.buttonsLineContainerBG_orphans =
						this.plugin.settings.newBG_orphans;
					inputText?.setValue(this.plugin.settings.newBG_orphans);
					inputText!.inputEl.style.backgroundColor =
						this.plugin.settings.newBG_orphans;
				}
				await this.plugin.saveSettings();
			});
		});
	}
}
