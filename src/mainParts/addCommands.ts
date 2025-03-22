import { Editor, MarkdownView, Plugin } from "obsidian";
import familyModal from "../createFamily/familyModal";
import { createClustersAndOrphansFolder } from "../createFamily/createClustersAndOrphansFolder";
import { NewFileLocation } from "../util/U";
import deleteActiveNoteModal from "src/createFamily/deleteActiveNoteModal";
import SimpleFocusClass from "src/focus/simpleFocus";
const SimpleFocus = new SimpleFocusClass();

export function addCommands(plugin: Plugin) {
	plugin.addCommand({
		id: "New-Cluster",
		name: "new cluster",
		callback: () => {
			createClustersAndOrphansFolder(plugin.app);
			new familyModal(
				plugin.app,
				NewFileLocation.NewTab,
				"newCluster",
				undefined,
			).open();
		},
	});
	plugin.addCommand({
		id: "New-Child",
		name: "New child",
		callback: () => {
			createClustersAndOrphansFolder(plugin.app);
			new familyModal(
				plugin.app,
				NewFileLocation.NewTab,
				"newChild",
				undefined,
			).open();
		},
	});
	plugin.addCommand({
		id: "New-Sibling",
		name: "New sibling",
		callback: () => {
			createClustersAndOrphansFolder(plugin.app);
			new familyModal(
				plugin.app,
				NewFileLocation.NewTab,
				"newSibling",
				undefined,
			).open();
		},
	});
	plugin.addCommand({
		id: "New-Orphan",
		name: "New orphan",
		callback: () => {
			createClustersAndOrphansFolder(plugin.app);
			new familyModal(
				plugin.app,
				NewFileLocation.NewTab,
				"newOrphan",
				undefined,
			).open();
		},
	});
	plugin.addCommand({
		id: "Delete-Active-Note",
		name: "Delete active note",
		callback: () => {
			createClustersAndOrphansFolder(plugin.app);
			new deleteActiveNoteModal(
				plugin.app,
				NewFileLocation.NewTab,
				"deleteNote",
			).open();
		},
	});
	plugin.addCommand({
		id: "simple-focus-exit-focus",
		name: "Exit focus",
		icon: "log-out",
		callback: () => {
			SimpleFocus.exitFocus();
		},
	});
	plugin.addCommand({
		id: "simple-focus-enter-focus",
		name: "Enter focus",
		icon: "focus",
		callback: () => {
			const file = plugin.app.workspace.getActiveFile();
			if (file?.path) {
				SimpleFocus.enterFocus(file.path);
			}
		},
	});
	plugin.addCommand({
		id: "delete-current-line",
		name: "Delete current line",
		icon: "scissors-line-dashed",
		callback: () => {
			const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
			const editor = view?.editor as Editor;
			editor.exec("deleteLine");
			editor.focus();
		},
	});
	plugin.addCommand({
		id: "undo-last-edit",
		name: "Undo last edit",
		callback: () => {
			const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
			const editor = view?.editor as Editor;
			editor.undo();
			editor.focus();
		},
	});
}
