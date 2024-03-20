## Did

-   [*] this.app this.app doesn't exist. This might work because its falling back to the global.app instance, but this is deprecated. You should pass app into the function instead .in familyModal.ts

## ToDo

-   [ ] FIX you need to add buttons line when onload if there is an active file
-   [ ] make the extra buttons [ puzzle ] functionality implementation

-   [ ] this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => { what is this code doing? This seems to just be finding any markdown leaf. Why? Do you mean to access activeLeaf? You probably want to use getActiveViewOfType(MarkdownView) instead.
