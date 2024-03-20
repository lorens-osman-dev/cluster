## Did

-   [*] getActiveViewOfType(MarkdownView) instead deprecated activeLeaf in buttons.ts

## ToDo

-   [ ] FIX you need to add buttons line when onload if there is an active file
-   [ ] make the extra buttons [ puzzle ] functionality implementation

-   [ ] this.app this.app doesn't exist. This might work because its falling back to the global.app instance, but this is deprecated. You should pass app into the function instead
-   [ ] this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => { what is this code doing? This seems to just be finding any markdown leaf. Why? Do you mean to access activeLeaf? You probably want to use getActiveViewOfType(MarkdownView) instead.
-   [ ] this.app.vault.adapter.exists getAbstractFileByPath Prefer the Vault API over the Adapter API
-   [ ] https://github.com/obsidianmd/obsidian-api/blob/9754fc87dd9a417f198a5cad7f08959206d2f69c/obsidian.d.ts#L4166 you should move the file to the trash instead of deleting it https://github.com/obsidianmd/obsidian-api/blob/9754fc87dd9a417f198a5cad7f08959206d2f69c/obsidian.d.ts#L4166
