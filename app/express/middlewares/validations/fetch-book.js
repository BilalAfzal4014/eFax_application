const HttpResponseHandler = require("../../../errors/handlers/http-error-response-handler");
const ErrorTypes = require("../../../errors/error-types");
const BusinessError = require("../../../errors/business-error");
const GeneralHelper = require("../../../helpers/general-helper");

module.exports = function(booksColumnAllowedValues = ["id", "name"]){
    return function(req, resp, next){
        if(GeneralHelper.isValueExistInArray(booksColumnAllowedValues, req.params.column)){
            next();
            return;
        }
        sendErrorBecauseOfWrongColumnParam(resp, `Only these column(s) ${booksColumnAllowedValues} are allowed`);
    }
};


function sendErrorBecauseOfWrongColumnParam(response, errorMessage){
    return new HttpResponseHandler(response).handleError(new BusinessError(
        ErrorTypes.NOT_FOUND,
        errorMessage, [],
        "BusinessError from middleware function of FetchBookUseCase"
    ));
}