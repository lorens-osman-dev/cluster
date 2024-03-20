import { App, TFolder } from "obsidian";
import { firstClusterTemplate } from "./templates";
const clusters = "CLUSTERS"
const orphans = "ORPHANS"
export async function createClustersAndOrphansFolder(app: App) {
    const t = app
    try {
        //orphans folder
        const orphansFolderExists = t.vault.getAbstractFileByPath(`${orphans}`);
        if (!orphansFolderExists) await t.vault.createFolder(`/${orphans}`);
        //cluster folder
        const clusterFolderExists = t.vault.getAbstractFileByPath(`${clusters}`);
        if (!clusterFolderExists) await t.vault.createFolder(`/${clusters}`);

        //@ts-ignore
        const isOtherClusters = t.vault.getRoot().children?.find((item: any) => item instanceof TFolder && item.name == clusters).children.length
        if (isOtherClusters == 0) {
            const fileExists = t.vault.getAbstractFileByPath(`${clusters}/First-cluster.md`);
            if (!fileExists) await t.vault.create(`/${clusters}/First-cluster.md`, firstClusterTemplate);
        }
    } catch (error) {
        console.log(error);
    }
}