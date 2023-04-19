
const Kuroshiro = require("kuroshiro")
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji")

const { translate } = require('@vitalets/google-translate-api');

const express = require('express');
const router = express.Router();
const cors = require('cors');

var HttpProxyAgent = require('http-proxy-agent');

// var agent = new HttpProxyAgent("http://137.184.245.154:80");

// initialize agents to make request to google translate API (bypass too many request error)
const availableAgents = [
    new HttpProxyAgent("http://137.184.245.154:80"),
    new HttpProxyAgent("http://84.248.46.187:80"),
    new HttpProxyAgent("http://4.233.217.172:80"),
    new HttpProxyAgent("http://45.92.108.112:80"),
    new HttpProxyAgent("http://185.162.251.76:80"),
    new HttpProxyAgent("http://161.97.93.15:80"),
    new HttpProxyAgent("http://34.75.202.63:80"),
    new HttpProxyAgent("http://203.57.51.53:80"),
    new HttpProxyAgent("http://139.99.135.214:80"),
    new HttpProxyAgent("http://102.165.4.52:8001"),
]

// initialize hiragana converter
const kuroshiro = new Kuroshiro()
kuroshiro.init(new KuromojiAnalyzer())


router.get('/hiragana', async (req, res) => {
    const data = req.query.data;
    var result;

    try {
        result = await kuroshiro.convert(data, {
            to: "hiragana"
         });
    } catch (error) {
        result = "converted failed at " + data; 
    }
    
    res.send(result)

    }
);

// refresh access token using spotify API
router.get('/translate', async (req, res) => {
    const data = req.query.data;
    var result;
    var proxyID = 0;

    // function to get response from the google translate api
    const getResponseProxy = async (agent) => {
        response = await translate(data, {
            to: 'zh-cn',
            fetchOptions: { agent }
        });
        return response;
    }

    // try another proxy if the current one doesn't work
    while (proxyID < availableAgents.length) {
        try {
            const response = await getResponseProxy(availableAgents[proxyID]);
            result = response;
            break;
        } catch (error) {
            console.log(`Proxy ${proxies[i]} failed. Trying next proxy...`);
            proxyID++;
            continue;
        }
    }
    
    res.send(result)
    }
);

// enable cors 
router.use(cors());

module.exports = router;