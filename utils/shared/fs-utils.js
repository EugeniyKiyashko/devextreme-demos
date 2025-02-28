'use strict';

const fs = require('fs');
const path = require('path');
const demosPathPrefix = path.join('utils', 'templates');
const descriptionFileName = 'description.md';

const copyDemos = (demoPath, approaches, newOrExisting, menuMetaData, baseDemosDir) => {
    if(newOrExisting.choice === 'new') {
        copyFilesFromBlankDemos(approaches, demoPath);
    } else {
        copyFilesFromExistingDemos(approaches, demoPath, newOrExisting, menuMetaData, baseDemosDir);
    }
    console.log('files for selected approaches were copied');
};

const copyFilesFromExistingDemos = (approaches, demoPath, newOrExisting, menuMetaData, baseDemosDir) => {
    approaches.forEach((approach) => {
        const demoPathByMeta = getDemoPathByMeta(newOrExisting.category, newOrExisting.group, newOrExisting.demo, baseDemosDir, menuMetaData);
        const fromPath = path.join(demoPathByMeta, approach);
        const toPath = path.join(demoPath, approach);

        if(!fs.existsSync(toPath)) {
            fs.mkdirSync(toPath, { recursive: true });
        }
        copyRecursiveSync(fromPath, toPath);
    });
};

const copyFilesFromBlankDemos = (approaches, demoPath) => {
    approaches.forEach((approach) => {
        const fromPath = path.join(demosPathPrefix, approach);
        const toPath = path.join(demoPath, approach);
        copyRecursiveSync(fromPath, toPath);
    });

    fs.writeFileSync(path.join(demoPath, descriptionFileName), '', function(err) {
        if(err) throw err;
        console.log('description.md copied');
    });
};

const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if(isDirectory) {
        if(!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

const getDemoPathByMeta = (categoryName, groupName, demoName, baseDemosDir, menuMetaData) => {
    const categoryIndex = menuMetaData.findIndex(x => x.Name === categoryName);
    const groupIndex = menuMetaData[categoryIndex].Groups.findIndex(x => x.Name === groupName);
    const demo = menuMetaData[categoryIndex].Groups[groupIndex].Demos.find(x => x.Name === demoName);
    const result = path.join(baseDemosDir, demo.Widget, demo.Name);
    return result;
};

const getMissingApproaches = (demoPath, approachesList) => {
    const currentDemos = getApproachesList(demoPath);
    const missingApproaches = approachesList.filter(approach => !currentDemos.includes(approach));
    return missingApproaches;
};

const saveMetaDataFile = (menuMetaDataFilePath, metaData) => {
    console.log('Saving: menuMeta.json');
    fs.writeFileSync(menuMetaDataFilePath, JSON.stringify(metaData, null, 2));
    console.log('Saved: menuMeta.json');
};

const getApproachesList = (demoPath) => {
    if(!fs.existsSync(demoPath)) {
        throw new Error('Directory does not exist:', demoPath);
    }

    const demosList = fs.readdirSync(demoPath, { withFileTypes: true })
        .filter(dirEntity => dirEntity.isDirectory())
        .map(dirEntity => dirEntity.name);
    return demosList;
};

const isValidDirectory = (directoryPath) => {
    return fs.existsSync(directoryPath) && fs.lstatSync(directoryPath).isDirectory();
};

const getWidgets = (widgetsPath, newWidget) => {
    const result = fs.readdirSync(widgetsPath, { withFileTypes: true })
        .filter(dirEntity => dirEntity.isDirectory())
        .map((dirEntity) => ({ title: dirEntity.name }));

    if(newWidget) {
        result.unshift({ title: newWidget, value: 'new' });
    }
    return result;
};

const recreateLink = (src, dest, callback) => {
    if(!dest) {
        if(fs.existsSync(src)) {
            fs.rmdirSync(src, { recursive: true });
        }

        fs.mkdir(src, (error) => {
            if(error) {
                console.log(error);
                return;
            }

            console.log(src + ' is created');
        });
    } else {
        if(fs.existsSync(dest)) {
            fs.unlinkSync(dest);
        }

        fs.symlink(src, dest, (error) => {
            if(error) {
                console.log(error);
                return;
            }

            if(callback) callback();

            console.log(dest + ' link is created');
        });
    }
};

module.exports = {
    copyDemos,
    copyRecursiveSync,
    getDemoPathByMeta,
    getMissingApproaches,
    getApproachesList,
    saveMetaDataFile,
    getWidgets,
    isValidDirectory,
    recreateLink
};
