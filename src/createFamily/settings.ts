import clusterPlugin from "../../main";
import { App, PluginSettingTab, Setting, TextComponent, ToggleComponent, WorkspaceContainer } from "obsidian";

export class settingTab extends PluginSettingTab {
    plugin: clusterPlugin;

    constructor(app: App, plugin: clusterPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();
        containerEl.classList.add("clusterSettingPage")

        new Setting(containerEl).setName("Cluster Plugin Settings")
        new Setting(containerEl).setClass("settingsBackground")
        //-Fold Properties
        const t = new Setting(containerEl)
        t.setName("Fold Properties");
        t.setDesc("Automatically fold the 'Properties' section upon opening files, and you'll observe the effect when a new file is opened.ONLY work inside [CLUSTERS] and [ORPHANS] folders .")
        t.addToggle((toggle: ToggleComponent) => {
            toggle.setValue(this.plugin.settings.foldProperties);
            toggle.onChange(async (value) => {
                this.plugin.settings.foldProperties = value;
                await this.plugin.saveSettings();
            });
        });

        //- First Page Of Clusters
        const firstPOC = new Setting(containerEl)
        firstPOC.setName("Main Notes Background color");
        firstPOC.setDesc("Highlight the main note of each cluster whose name ends with '-cluster' by adding a background color.")
        firstPOC.addToggle((toggle: ToggleComponent) => {
            toggle.setValue(this.plugin.settings.firstPageClusters);
            toggle.onChange(async (value) => {
                this.plugin.settings.firstPageClusters = value;
                await this.plugin.saveSettings();
            });
        });


        //-Colors
        new Setting(containerEl).setName("Buttons Background Color")

        //-clusters buttons background color 
        this.clusterFun(new Setting(containerEl))


        //- buttons background color 
        this.orphanFun(new Setting(containerEl))


        //-GitHub
        new Setting(containerEl)
            .setName("GitHub")
            .setDesc("Report Issues or Ideas, see the Source Code and Contribute.")
            .addButton(button => {
                button.setIcon("github")
                button.onClick(() => window.location.href = "https://github.com/lorens-osman-dev/cluster")
            });
        //-Donation
        new Setting(containerEl)
            .setName("Make First Dream True")
            .setDesc("If you like this Plugin, Consider making first dream true.")
            .addButton(button => {
                button.setIcon("coffee")
                button.setClass("coffeeSettingBtn")
                button.onClick(() => window.location.href = "https://www.buymeacoffee.com/lorens")
            });


    }

    clusterFun(setting: Setting) {
        //-make input with its text
        setting.setClass("color_input")
        setting.setHeading()
        let inputText: TextComponent | null = null
        const input = setting.addText((text: TextComponent) => {
            inputText = text
            text.setValue(this.plugin.settings.buttonsLineContainerBG_clusters);
            text.onChange(async (value: string) => {
                text.inputEl.style.backgroundColor = value
                this.plugin.settings.newBG_clusters = value
                this.plugin.settings.buttonsLineContainerBG_clusters = value
                await this.plugin.saveSettings();
            })
        })

        input.controlEl.createEl("div", { text: "clusters buttons background color ", cls: "inputExtraText clusters" })

        //- on load effect 
        if (this.plugin.settings.restBgClusters) {
            input.controlEl.classList.add("inputDisable")
            input.controlEl.classList.remove("inputEnable")
            if (inputText !== null) {
                (inputText as TextComponent).inputEl.style.backgroundColor = "var(--background-button-container-clusters)";
            }
        } else {
            input.controlEl.classList.add("inputEnable")
            input.controlEl.classList.remove("inputDisable")
            if (inputText !== null) {
                (inputText as TextComponent).inputEl.style.backgroundColor = this.plugin.settings.newBG_clusters;
            }
        }
        //-make toggle with its text
        setting.addToggle((toggle: ToggleComponent) => {
            toggle.toggleEl.classList.add("customToggle")
            toggle.toggleEl.createEl("div", { text: "Default value", cls: "toggleExtraText" })//extra text 
            toggle.setValue(this.plugin.settings.restBgClusters);
            toggle.onChange(async (value) => {
                if (value === true) {
                    this.plugin.settings.restBgClusters = true
                    this.plugin.settings.buttonsLineContainerBG_clusters = "var(--background-button-container-clusters)";
                    inputText!.setValue("var(--background-button-container-clusters)");
                    inputText!.inputEl.style.backgroundColor = "var(--background-button-container-clusters)";
                    input.controlEl.classList.add("inputDisable")
                    input.controlEl.classList.remove("inputEnable")

                } else {
                    input.controlEl.classList.add("inputEnable")
                    input.controlEl.classList.remove("inputDisable")

                    this.plugin.settings.restBgClusters = false
                    this.plugin.settings.buttonsLineContainerBG_clusters = this.plugin.settings.newBG_clusters;
                    inputText!.setValue(this.plugin.settings.newBG_clusters);
                    inputText!.inputEl.style.backgroundColor = this.plugin.settings.newBG_clusters;
                }
                await this.plugin.saveSettings();
            });
        });
    }
    orphanFun(setting: Setting) {
        //-make input with its text
        setting.setClass("color_input")
        setting.setHeading()
        let inputText: TextComponent | null = null
        const input = setting.addText((text: TextComponent) => {
            inputText = text
            text.setValue(this.plugin.settings.buttonsLineContainerBG_orphans);
            text.onChange(async (value: string) => {
                text.inputEl.style.backgroundColor = value
                this.plugin.settings.newBG_orphans = value
                this.plugin.settings.buttonsLineContainerBG_orphans = value
                await this.plugin.saveSettings();
            })
        })
        input.controlEl.createEl("div", { text: "orphans buttons background color ", cls: "inputExtraText orphans" })

        //- on load effect 
        if (this.plugin.settings.restBgOrphans) {
            input.controlEl.classList.add("inputDisable")
            input.controlEl.classList.remove("inputEnable")
            if (inputText !== null) {
                (inputText as TextComponent).inputEl.style.backgroundColor = "var(--background-button-container-orphans)";
            }
        } else {
            input.controlEl.classList.add("inputEnable")
            input.controlEl.classList.remove("inputDisable")
            if (inputText !== null) {
                (inputText as TextComponent).inputEl.style.backgroundColor = this.plugin.settings.newBG_orphans;
            }
        }
        //-make toggle with its text
        setting.addToggle((toggle: ToggleComponent) => {
            toggle.toggleEl.classList.add("customToggle")
            toggle.toggleEl.createEl("div", { text: "Default value", cls: "toggleExtraText" })//extra text 
            toggle.setValue(this.plugin.settings.restBgOrphans);
            toggle.onChange(async (value) => {
                if (value === true) {
                    this.plugin.settings.restBgOrphans = true
                    this.plugin.settings.buttonsLineContainerBG_orphans = "var(--background-button-container-orphans)";
                    inputText!.setValue("var(--background-button-container-orphans)");
                    inputText!.inputEl.style.backgroundColor = "var(--background-button-container-orphans)";
                    input.controlEl.classList.add("inputDisable")
                    input.controlEl.classList.remove("inputEnable")

                } else {
                    input.controlEl.classList.add("inputEnable")
                    input.controlEl.classList.remove("inputDisable")

                    this.plugin.settings.restBgOrphans = false
                    this.plugin.settings.buttonsLineContainerBG_orphans = this.plugin.settings.newBG_orphans;
                    inputText!.setValue(this.plugin.settings.newBG_orphans);
                    inputText!.inputEl.style.backgroundColor = this.plugin.settings.newBG_orphans;
                }
                await this.plugin.saveSettings();
            });
        });
    }
}
