var server = require('ws').Server
const fs = require('fs')
const generatorValidator = require('./generatorValidator/index')
const LogPrinter = require('./LogPrinter/index')
const ReadJSON = require('./ReadJSON/index')
let ListOffeatures = [];
var serverInstance = new server({
    port: 5001
},()=>{
    ListOffeatures= ReadJSON.main('./../features/Feature.json')
    
})
// eslint-disable-next-line no-unused-vars


serverInstance.on('connection', async (ws) => {
    // fs.readFile('./features/Feature.json', 'utf8', (error, data) => {
    //     ListOffeatures = JSON.parse(data)
    // })
    ws.on('message', (message) => {
        message = JSON.parse(message)
        if (message['type'] == 'GeneratorSetter') {
            generatorValidator.main(ws._socket.remoteAddress).then(() => {
                ws['type'] = 'Generator'
                ws['patientId'] = message['patientId']
            })
                .catch(err => {
                    ws.send('Not A valid generator')
                    console.log('not a valid generator', err)
                    ws.close();
                })
        }
        else if (message['type'] == 'SubscriberSetter') {
            ws['type'] = 'Subscriber'
            ws['patientId'] = message['patientId']
        }
        else if (message['type'] == 'Generator') {
            generatorValidator.main(ws._socket.remoteAddress).then(() => {
                serverInstance.clients.forEach((client) => {
                    if (client != ws && client.type == 'Subscriber' && client.patientId == message.patientId) {
                        client.send(JSON.stringify(LogPrinter.main(message, ListOffeatures)))
                    }
                })
            })
                .catch(err => {
                    ws.send('Error Occured')
                    console.log('Error occured', err)
                    ws.close();
                })
        }
        else if (message['type'] == 'Subscriber') {
            ws.send('Subscriber is not allowed to send Data');
            ws.close();
            console.log('Subscriber is not allowed to send Data');
        }
        else {
            ws.send('Invalid Type');
            ws.close();
        }
    })
    ws.on('error', (error) => {
        console.log(JSON.stringify(error))
        ws.close();
    })
    ws.on('close', () => {
        console.log('Closed')
    })
})