import { readFile, writeFile } from 'fs';
import { execSync } from "child_process";
// Define the package semver and app version
const packageSemver = "3.0.1"; // Replace with your desired package semver
const appVersion = "1.8.4";    // Replace with your desired app version

// Paths to the JSON files
const versionsFilePath = './versions.json';
const manifestFilePath = './manifest.json';
const packageFilePath = './package.json';

// Function to update versions.json
function updateVersionsFile() {
    readFile(versionsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading versions.json:', err);
            return;
        }

        try {
            const versions = JSON.parse(data);
            versions[packageSemver] = appVersion;

            const updatedJson = JSON.stringify(versions, null, '\t');
            writeFile(versionsFilePath, updatedJson, 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to versions.json:', writeErr);
                } else {
                    console.log(`Successfully added "${packageSemver}: ${appVersion}" to versions.json`);
                }
            });
        } catch (parseErr) {
            console.error('Error parsing versions.json:', parseErr);
        }
    });
}

// Function to update manifest.json
function updateManifestFile() {
    readFile(manifestFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading manifest.json:', err);
            return;
        }

        try {
            const manifest = JSON.parse(data);
            manifest.version = packageSemver;       // Update the version field
            manifest.minAppVersion = appVersion;    // Update the minAppVersion field

            const updatedJson = JSON.stringify(manifest, null, '\t');
            writeFile(manifestFilePath, updatedJson, 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to manifest.json:', writeErr);
                } else {
                    console.log(`Successfully updated manifest.json: version="${packageSemver}", minAppVersion="${appVersion}"`);
                }
            });
        } catch (parseErr) {
            console.error('Error parsing manifest.json:', parseErr);
        }
    });
}
// Function to update package.json
function updatePackageJsonFile() {
    readFile(packageFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading package.json:', err);
            return;
        }

        try {
            const packageJson = JSON.parse(data);
            packageJson.version = packageSemver;       // Update the version field

            const updatedJson = JSON.stringify(packageJson, null, '\t');
            writeFile(packageFilePath, updatedJson, 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to package.json:', writeErr);
                } else {
                    console.log(`Successfully updated package.json: version="${packageSemver}"`);
                }
            });
        } catch (parseErr) {
            console.error('Error parsing manifest.json:', parseErr);
        }
    });
}

// Function to perform Git operations
function gitCommitAndTag() {
    try {
        // Stage all changes
        execSync('git add .');
        console.log('Successfully staged all changes.');

        // Commit with the packageSemver as the message
        execSync(`git commit -m "v${packageSemver}"`);
        console.log(`Successfully committed changes with message: "v${packageSemver}".`);

        // Create a Git tag with the packageSemver
        execSync(`git tag v${packageSemver}`);
        console.log(`Successfully created Git tag: v${packageSemver}.`);

        console.log('Bump process completed successfully!');
    } catch (gitErr) {
        console.error('Error during Git operations:', gitErr.message || gitErr);
    }
}

// Run both functions
updateVersionsFile();
updateManifestFile();
updatePackageJsonFile();
gitCommitAndTag();