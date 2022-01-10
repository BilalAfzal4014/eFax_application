const router = require("express").Router();
const {handleMediaUpload} = require("../../multipart/multipart-handler");
const HttpResponseHandler = require("../../../errors/handlers/http-error-response-handler");
const SaveFaxUseCase = require("../../../usecases/fax/save-fax-usecase");

router.post("/mockfax", handleMediaUpload("file", ".pdf"), function (req, res) {
    const payLoad = {
        ...req.body,
        file: req.file
    };
    (new SaveFaxUseCase(payLoad)).saveFax()
        .then((fax) => {
            return res.status(200).json(fax);
        }).catch((error) => {
        return new HttpResponseHandler(res).handleError(error);
    });
});

router.post("/receiveFaxStatus", function (req, res) {
    console.log("req is:", req.body);
    if (req.body.status === "failure")
        res.status(400).json(req.body);
    else
        res.status(200).json(req.body);
});


module.exports = router;