const multer = require("multer");
const path = require("path");

const handleSingleFileUpload = (name, supportedExtensions, fileSize = (30 * mb())) => {
    return (req, resp, next) => {
        const fileHandler = prepareFileHandler(name, supportedExtensions, fileSize, "single");
        fileHandler(req, resp, (error) => {
            if (error) {
                handleError(resp, error);
            } else {
                next();
            }
        });
    };
};


const prepareFileHandler = (name, supportedExtensions, fileSize, fileUploadOption) => {
    return multer({
        fileFilter: prepareFileFilter(supportedExtensions),
        storage: multer.memoryStorage(),
        limits: {fileSize: fileSize || 8000000}
    })[fileUploadOption](name);
}

const mb = () => 1024 * 1024;

const prepareFileFilter = (supportedExtensions) => {
    return (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        if (supportedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb([`files with only ${supportedExtensions} extension are allowed`], new Error(`Only ${supportedExtensions} are allowed`), false);
        }
    };
}

const handleError = (resp, error) => {
    console.error("Error occurred while uploading file(s)", error);
    if (error instanceof multer.MulterError) {
        resp.status(500).send({message: "Some error occurred while uploading file(s), please consult your system administrator."});
    } else {
        resp.status(400).send({message: "Could not upload file(s), please verify file being uploaded.", error});
    }
}

module.exports = {
    handleMediaUpload: (name, supportedFormats) => handleSingleFileUpload(name, supportedFormats),
};