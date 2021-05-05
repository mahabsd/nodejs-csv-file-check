const translatte = require('translatte');
//generate random file name
exports.randomFileName = () => {
    let randomName = Math.random().toString(36).substring(7);
    return randomName
}

//empty case check
exports.emptyCaseCheck = (sheet) => {
    let sheet1 = sheet
    var x = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let j = 0; j < x.length; j++) {
        for (let i = 1; i < sheet1.length; i++) {
            if (!sheet1[1][0][x[j]] && sheet1[1][i][x[j]]) {
                sheet1[1][0][x[j]] = 'CASE ' + (j + 1)
                i = sheet1.length
            }
        }
    }
    return sheet1
}

//model-excel file comparison and translation
exports.modelExcelCompare = (excelHeader, modelArray) => {
    let found = []
    let notFound = []
    let result = []
    excelHeader.forEach( (element) => {
        if (modelArray.includes(element)) {
            found.push(element);
        } else {
            notFound.push(element);
        }
    });
    result.push(found, notFound)
    return result

}

//delete unwanted header in excel sheet
exports.deleteUnwantedHeader = (jsonArr) => {
    for (let i = 0; i < jsonArr.length; i++) {
        for (const [key, value] of Object.entries(jsonArr[i])) {
            if (value == "other") {
                for (let j = 0; j < jsonArr.length; j++) {
                    delete jsonArr[j][key]
                }
            }
        }
    }
}