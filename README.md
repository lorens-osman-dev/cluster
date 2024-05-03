![clusterSvg](https://raw.githubusercontent.com/lorens-osman-dev/cluster/16c7f97a3f24322de18d9540fa7170817b80a7cc/cluster-plugin-lorens-osman.svg)

## Cluster plugin mainly designed to simplify the process of note clustering for [Obsidian](https://obsidian.md/) on mobile devices and work well on PCs ether.

### Note Clustering

Note clustering is a way to create a hierarchy or structure among your notes, making it easier to navigate, search and understand the relationships between them.

### Cluster Plugin

Provides parent-child hierarchy, commands, in-note buttons, and ribbon buttons to make clustering process easier on mobile devices and work well on PCs ether.

**Simple Example:**
Imagine you have notes about different Programming topics. So you need organize your notes like:

-   Programming (Main Note)
    -   JavaScript 
        -   Array
        -   for loop
        -   functions 
        -   if statements 
        -   variables
            - var
            - const
            - let 
    -   Css 
        -   ID 
        -   Class 
        -   Element 

With `Cluster` plugin you can make that easily .

Youtube Demo how to make Programming topics with `Cluster` plugin easily:

[![youtube cluster demo](https://github.com/lorens-osman-dev/cluster/assets/114411575/8d784150-a011-430d-b0fd-1210723446a3)](https://www.youtube.com/watch?v=EQDt_44u_Wo)

The Result :


<img src="https://github.com/lorens-osman-dev/cluster/assets/114411575/7f7bc9a5-e919-4761-b5a8-e47bab44b819" width="250"  height="250">

Folder Structure :


<img src="https://github.com/lorens-osman-dev/cluster/assets/114411575/b05686e8-bb1c-4a23-b691-b50ff607794e" width="300"  height="600">



### Don't be scared by the words!

I know this explanation might sound a bit technical and might make things sound complicated, But using the plugin is actually super easy, intuitive and straightforward. You'll learn the plugin much faster by giving it a try than by reading all the details first.

### Before clustering your notes with `Cluster` plugin

You'll need two folders `CLUSTERS` and `ORPHANS`. The `CLUSTERS` folder will contain all linked notes, while the `ORPHANS` folder will contain notes that aren’t linked.

You can create these folders manually, or they will be created automatically if you click the `Create new cluster` button on the ribbon, this button will check if the `CLUSTERS` and `ORPHANS` folders exist, if these folders do not exist, it will create them before creating a new cluster inside the `CLUSTERS` folder.

### Buttons

When you open a note from either the `CLUSTERS` or `ORPHANS` folder the `Cluster` plugin displays two sets of buttons, One set is specifically for notes in the `CLUSTERS` folder, while the other set is for notes in the `ORPHANS` folder.

#### CLUSTERS Buttons

![clusters buttons](https://github.com/lorens-osman-dev/cluster/blob/assets/clusters-buttons.png?raw=true)

#### ORPHANS Buttons

![ORPHANS Buttons](https://github.com/lorens-osman-dev/cluster/blob/assets/orphans-buttons.png?raw=true)

![cluster](https://github.com/lorens-osman-dev/cluster/blob/assets/cluster.svg)

-   This button creates new note inside `CLUSTERS` folder and the note's name will followed by `-cluster` added to the end.
-   We refer to this note as the `cluster`, and it's the main note.
-   The `cluster` has a generation value of `0` as property .
-   The `cluster` has a tag called `Cluster`. All main notes (also known as `cluster`) will have this `Cluster` tag.

![baby](https://github.com/lorens-osman-dev/cluster/blob/assets/babdc.svg)

-   This button creates a new note linked to the current note, we call it `son` note.
-   `son` note means the new created note will contains link to the current note and tag with cluster's name.
-   The generation property of the `son` note will be the current note's generation +1
-   A new folder with the same name of current note will be created for all `son` notes of the current note.

![brother](https://github.com/lorens-osman-dev/cluster/blob/assets/git-compare.svg)

-   This button creates a new note beside the current note, we call it `brother` note.
-   `brother` note means the new created note will copy the parent link, the cluster's tag and the generation property from current note.

![orphan](https://github.com/lorens-osman-dev/cluster/blob/assets/disc.svg)

-   This button creates a new note inside `ORPHANS` folder.
-   `orphan` note has no parent link and no hierarchy.

![delete](https://github.com/lorens-osman-dev/cluster/blob/assets/trash-2.svg)

-   This button deletes current note.
-   If the current note has no brothers the containing folder will be deleted.
-   If the current note has sons the sons will be deleted along with their own folders.
-   If the current note is `cluster` all the cluster's files and folders will be deleted.

![extra buttons](https://github.com/lorens-osman-dev/cluster/blob/assets/arrow-left-square.svg?raw=true)

-   Toggle extra buttons.

![deletes the current line](https://github.com/lorens-osman-dev/cluster/blob/assets/arrow-left-from-line.svg?raw=true)

-   This button deletes the current line.
-   Very useful for phone users.
-   Very useful to delete images and links when using phone device.

### 🤩🪄 Plugin Features

-   Easy note clustering on phone devices and PCs.
-   Intuitive folders: Group related notes into folders for maintain a clear hierarchy folder structure.
-   Automatically generate useful note properties that's helps with search, graph view and maintain note clustering process.

### ⚙️ PC Recommendation

-   Set `Ctrl+Shift+B` hotkey to New brother command.
-   Set `Ctrl+Shift+S` hotkey to New son command.
-   Set `Ctrl+Shift+C` hotkey to New cluster command.
-   Set `Ctrl+Shift+D` hotkey to Delete active note command.

If you like this plugin, feel free to support the development by buying a coffee:

## <a href="https://www.buymeacoffee.com/lorens" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

### Credits

Thank you for everyone in the Obsidian community that have contributed to testing and bug reporting.

Some of our inspiration came from the following project
https://github.com/vanadium23/obsidian-advanced-new-file
