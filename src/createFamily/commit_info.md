## Did

-   [*] this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => { what is this code doing? This seems to just be finding any markdown leaf. Why? Do you mean to access activeLeaf? You probably want to use getActiveViewOfType(MarkdownView) instead.

## ToDo

-   [ ] FIX you need to add buttons line when onload if there is an active file
-   [ ] make the extra buttons [ puzzle ] functionality implementation
-   [ ] when you rename parent note you need rename the son's containing folder with same name
-   [ ] make Scope feature like the one in vs code
