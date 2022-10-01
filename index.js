// https://api-newcore.vietvictory.vn/storage/get_charge_category
const { default: axios } = require('axios');
const { json } = require("express")
const express = require("express")
const app = express()
const redis = require("redis")
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
 const redisClient = redis.createClient();

(async () => {
    await redisClient.connect()
})()


app.get('/', async (req, res) => {
    const categories = await redisClient.get("category")

    if(categories != null){
        console.log('Hit')
        return res.status(200).json(JSON.parse(categories))
    }else{
        console.log('Miss')
        const category = await axios.get('https://api-newcore.vietvictory.vn/storage/get_charge_category')
        let data = category.data.rows
        await redisClient.setEx("category", 3600, JSON.stringify(data))

        return res.status(200).json(data)
    }
})

app.listen(3000, () => {
    console.log("CONNECTED")
})

