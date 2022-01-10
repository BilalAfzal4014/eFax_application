const fs = require('fs');
const path = require("path");
const {v4: uuid} = require("uuid");

module.exports = class LocalStorage {

    saveFileFromBuffer(file, directory) {
        const fileInformation = this.getCompleteFileNameWithPath(file, directory);
        const stream = fs.createWriteStream(fileInformation.fileNameWithPath);
        return new Promise((resolve, _) => {
            stream.once('open', function () {
                stream.write(file.buffer);
                stream.end();
                resolve(fileInformation);
            });
        });
    }

    getCompleteFileNameWithPath(file, directory) {
        const fileUniqueName = uuid();
        const fileCompleteNameWithExtension = `${fileUniqueName}.${this.getExtensionFromMimeType(file.mimetype)}`;
        const fileNameWithPath = this.getLocalStoragePath() + "/" + directory + "/" + fileCompleteNameWithExtension;
        return {
            fileCompleteNameWithExtension,
            fileNameWithPath
        };
    }

    getExtensionFromMimeType(mimeType) {
        return mimeType.split("/")[1];
    }

    getLocalStoragePath() {
        return path.join(__dirname, '../../../../files-storage');
    }
};