const router = require("express").Router();
const HttpResponseHandler = require("../../../errors/handlers/http-error-response-handler");
const SaveBookUseCase = require("../../../usecases/book/save-book-usecase");
const FetchBookUseCase = require("../../../usecases/book/fetch-books-usecase");
const middlewareErrorhandlerOfFetchBookDesiredColum = require("../../../express/middlewares/validations/fetch-book");

router.post("/", function(req, res){
    (new SaveBookUseCase(req.body)).saveBook()
        .then((book) => {
            return res.status(200).json(book);
        }).catch((error) => {
        return new HttpResponseHandler(res).handleError(error);
    });
});

router.get("/:column/:value",
    middlewareErrorhandlerOfFetchBookDesiredColum(),
    function(req, res){
        FetchBookUseCase.fetchByDesiredColumn(req.params.column, req.params.value)
            .then((books) => {
                return res.status(200).json(books);
            }).catch((error) => {
            return new HttpResponseHandler(res).handleError(error);
        });
});

router.get("/", function(req, res){
    FetchBookUseCase.fetchAll()
        .then((books) => {
            return res.status(200).json(books);
        }).catch((error) => {
        return new HttpResponseHandler(res).handleError(error);
    });
});

module.exports = router;