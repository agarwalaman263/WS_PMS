const fs = require('fs')
const path = require('path')
let returnJSON = (addressOfFile) => {
    try {
        let filePath = path.join(__dirname, addressOfFile)
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                throw (err)
            } else {
                data = JSON.parse(data)
                console.log(data)
                return (data)
            }
        })
    }
    catch (e) {
        console.log("Unable to read the Database JSON", e)
    }

}
module.exports = {
    main: returnJSON
}