const FaxModel = require("../models/fax-model");

class FaxRepo {

    static save(fax) {
        if (fax.id)
            return FaxModel.update(fax);
        else
            return FaxModel.save(fax);
    }

    static findByAttributes(attributes, extraAttributes, dontFetchDeleted = false) {
        return FaxRepo.findByAttributesAndIdIsNot(attributes, null, extraAttributes, dontFetchDeleted);
    }

    static findByAttributesAndIdIsNot(attributes, id, extraAttributes, dontFetchDeleted = false) {
        return FaxModel.findByAttributeWhereIdIsNotAndGivenModel(attributes, id, extraAttributes, dontFetchDeleted);
    }

}

module.exports = FaxRepo;