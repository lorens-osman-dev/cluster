import { readFile, writeFile } from "fs/promises"; // Use promises version of fs methods
import { execSync } from "child_process";
import chalk from "chalk"; //chalk  commonJs
import type { ForegroundColorName, BackgroundColorName } from "chalk";
type Msg = [string, ForegroundColorName | "white", BackgroundColorName | null];

// Define the package semver and app version
const packageSemver = "3.0.7"; // Replace with your desired package semver
const appVersion = "1.8.4"; // Replace with your desired app version

// Paths to the JSON files
const versionsFilePath = "./versions.json";
const manifestFilePath = "./manifest.json";
const packageFilePath = "./package.json";

// Function to check if the version Number is already used 
async function isVersionNumberUsed(): Promise<boolean | undefined> {
	try {
		const data = await readFile(manifestFilePath, "utf8");
		const manifest = JSON.parse(data);
		if (manifest.version === packageSemver) {
			console.log(
				logInsert([
					`>> version="${packageSemver}" is already used try to update it in bump.ts file.  ❌`,
					"red",
					null,
				]),
			);
			return true;
		}
		return false;

	} catch (err) {
		console.error("Error updating manifest.json:", err);
		return
	}
}
// Function to update versions.json
async function updateVersionsFile() {
	try {
		const data = await readFile(versionsFilePath, "utf8");
		const versions = JSON.parse(data);
		versions[packageSemver] = appVersion;
		const updatedJson = JSON.stringify(versions, null, "\t");
		await writeFile(versionsFilePath, updatedJson, "utf8");
		console.log(
			logInsert([
				`>> added "${packageSemver}: ${appVersion}" to versions.json.  ✓✓`,
				"blue",
				null,
			]),
		);
	} catch (err) {
		console.error("Error updating versions.json:", err);
	}
}

// Function to update manifest.json
async function updateManifestFile() {
	try {
		const data = await readFile(manifestFilePath, "utf8");
		const manifest = JSON.parse(data);
		manifest.version = packageSemver; // Update the version field
		manifest.minAppVersion = appVersion; // Update the minAppVersion field
		const updatedJson = JSON.stringify(manifest, null, "\t");
		await writeFile(manifestFilePath, updatedJson, "utf8");
		console.log(
			logInsert([
				`>> updated manifest.json: version="${packageSemver}", minAppVersion="${appVersion}".  ✓✓`,
				"blue",
				null,
			]),
		);
	} catch (err) {
		console.error("Error updating manifest.json:", err);
	}
}

// Function to update package.json
async function updatePackageJsonFile() {
	try {
		const data = await readFile(packageFilePath, "utf8");
		const packageJson = JSON.parse(data);
		packageJson.version = packageSemver; // Update the version field
		const updatedJson = JSON.stringify(packageJson, null, "\t");
		await writeFile(packageFilePath, updatedJson, "utf8");
		console.log(
			logInsert([
				`>> updated package.json: version="${packageSemver}.  ✓✓"`,
				"blue",
				null,
			]),
		);
	} catch (err) {
		console.error("Error updating package.json:", err);
	}
}

// Function to perform Git operations
function gitCommitAndTag() {
	try {
		// Stage all changes
		execSync("git add .");
		console.log();
		console.log(logInsert(["-- staged all changes.  ✓✓", "greenBright", null]));
		// Commit with the packageSemver as the message
		execSync(`git commit -m "v${packageSemver}"`);
		console.log(
			logInsert([
				`-- committed changes with message: "v${packageSemver}".  ✓✓`,
				"greenBright",
				null,
			]),
		);

		// Create a Git tag with the packageSemver
		execSync(`git tag ${packageSemver}`);
		console.log(
			logInsert([
				`-- created Git tag: ${packageSemver}.  ✓✓`,
				"greenBright",
				null,
			]),
		);
		console.log();
	} catch (gitErr) {
		console.error("Error during Git operations:", gitErr.message || gitErr);
	}
}

export function logInsert(msgArr: Msg) {
	const msg = {
		msg: msgArr[0],
		color: msgArr[1],
		bgColor: msgArr[2],
	};
	if (msg.bgColor !== null) {
		return chalk[msg.color][msg.bgColor](msg.msg);
	}
	return chalk[msg.color](msg.msg);
}
// Main function to run all steps in sequence
async function main() {
	const isUsed = await isVersionNumberUsed();
	if (isUsed) {
		return;
	}
	await updateVersionsFile();
	await updateManifestFile();
	await updatePackageJsonFile();
	gitCommitAndTag(); // This will only run after all file updates are complete
}

// Run the main function
main();
