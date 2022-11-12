const express = require('express')
const path = require('path')
const bodyparser = require('body-parser')
const bodyParser = require('body-parser')
const storage = require('nedb')
require('dotenv').config()


const Joi = require('joi')
const { join } = require('path')
const { json } = require('body-parser')
const { required } = require('joi')


const server = express()


server.use( '/fitPage' , express.static(path.join(__dirname + '/fitness')))
server.use( express.static(path.join(__dirname + '/folder')))
server.use(bodyparser.urlencoded({extended: true}))
server.use(bodyParser.json())

let dataBase = new storage('dataSheet.db');
dataBase.loadDatabase()






server.get('/lan', (req , res )=>{

   
    res.sendFile(path.join(__dirname , 'folder' , 'index.html'))

   
})



server.get('/data2', (req , res )=>{

   
    res.sendFile(path.join(__dirname , 'folder' , 'dataB.html'))

   
})







server.get('/data', (req , res )=>{

   
    
console.log(req.body);

    dataBase.find({},(err , data)=>{
    if(err){
        console.log(err);
    }else{

        res.send(data)

       

    }
   })

   
})




server.post('/gps', (req , res)=>{

                    const REQ = req.body

                    const timestamp = Date.now()

                    REQ.timestamp = timestamp

                console.log(REQ);

    dataBase.insert(REQ)
    
                console.log('data loaded');

   res.json(REQ)

                console.log('JSON sent....');

})


server.get('/wea/:lat/:log', async (req, res)=>{

let lat = req.params.lat
let log = req.params.log
 let key1 = process.env.API
 
   
    let weath = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&APPID=${key1}`)
    let weathJS = await weath.json()

    const air = await fetch(`https://api.openaq.org/v2/latest?coordinates=${lat},${log}`)
    const airJS = await air.json()
    
    const data = {
        weather: weathJS , 
        Air_quality: airJS
    }

    res.json(data)
})



let port = process.env.PORT

 


server.listen(port || 8080)