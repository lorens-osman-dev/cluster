import clusterPlugin from "../../main";
import { App, PluginSettingTab, Setting } from "obsidian";

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

        const t = new Setting(containerEl)
        t.setName("Fold Properties");
        t.setDesc("Automatically fold the 'Properties' section upon opening files, and you'll observe the effect when a new file is opened.ONLY work inside [CLUSTERS] and [ORPHANS] folders .")
        t.addToggle(toggle => toggle
            .setValue(this.plugin.settings.foldOption)
            .onChange(async (value) => {
                this.plugin.settings.foldOption = value;
                await this.plugin.saveSettings();
            }));

        new Setting(containerEl)
            .setName("GitHub")
            .setDesc("Report Issues or Ideas, see the Source Code and Contribute.")
            .addButton(button => {
                button.setIcon("github")
                button.onClick(() => window.location.href = "https://github.com/lorens-osman-dev/cluster")
            });
        new Setting(containerEl)
            .setName("Make First Dream True")
            .setDesc("If you like this Plugin, Consider making first dream true.")
            .addButton(button => {
                button.setIcon("coffee")
                button.setClass("coffeeSettingBtn")
                button.onClick(() => window.location.href = "https://www.buymeacoffee.com/lorens")
            });


    }
}