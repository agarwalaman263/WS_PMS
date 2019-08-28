let LogPrinter = (message, FeatureObject) => {
    let result = {}
    let eachKeymodal = {
        "Upper Bound": '',
        "Lower Bound": '',
        'Value':'',
        "State": ''
    }
    message = message['features']
    FeatureObject = FeatureObject['features']
    Object.keys(message).forEach(item => {
        result[item] = eachKeymodal
        result[item]["Upper Bound"] = FeatureObject[item]["Upper Bound"]
        result[item]["Lower Bound"] = FeatureObject[item]["Lower Bound"]
        result[item]["Value"]=message[item]
        if (message[item] < FeatureObject[item]["Upper Bound"] && message[item] > FeatureObject[item]["Lower Bound"])
            result[item]["State"] = 'Safe'
        else
            result[item]["State"] = 'unsafe'
    })
    return result
}
module.exports = {
    main: LogPrinter
}