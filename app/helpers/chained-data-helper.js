class ChainedDataHelper {

    static convertNestedToFlatArray(errors) {

        let errorList = [];

        for (let error of errors) {
            if (Array.isArray(error)) {
                errorList = [...errorList, ...ChainedDataHelper.convertNestedToFlatArray(error)]
            } else {
                errorList.push(error);
            }
        }

        return errorList;
    }

}

module.exports = ChainedDataHelper;