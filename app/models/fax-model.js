const {v4: uuid} = require("uuid");

const faxCollection = [];

class FaxModel {
    static save(fax) {
        fax.id = uuid();
        faxCollection.push(fax);
        return Promise.resolve(fax);
    }

    static update(fax) {
        for (let faxEle of faxCollection) {
            if (faxEle.id === fax.id) {
                faxEle = fax;
            }
        }
        return Promise.resolve(fax);
    }

    static findByAttributeWhereIdIsNotAndGivenModel(attributes, id, extraAttributes, dontFetchDeleted) {
        let searchedModelElements = [];
        for (let element of faxCollection) {
            for (let attribute of attributes) {
                if (element[attribute.key] == attribute.value) {
                    if (!id || element.id != id) {
                        searchedModelElements.push(element);
                        break;
                    }
                }
            }
        }

        if (!attributes.length)
            searchedModelElements = [...faxCollection];

        if (extraAttributes.length) {
            for (let i = 0; i < searchedModelElements.length; i++) {
                let element = searchedModelElements[i];
                for (let attribute of extraAttributes) {
                    if (element[attribute.key] != attribute.value) {
                        searchedModelElements.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
        }


        return Promise.resolve(searchedModelElements);
    }

}

module.exports = FaxModel;