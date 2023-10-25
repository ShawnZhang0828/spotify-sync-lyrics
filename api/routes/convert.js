const Kuroshiro = require("kuroshiro")
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji")

const { translate } = require('@vitalets/google-translate-api');
const request = require("request")
const cheerio = require('cheerio');

const express = require('express');
const router = express.Router();
const cors = require('cors');

var HttpProxyAgent = require('http-proxy-agent');

// initialize hiragana converter
const kuroshiro = new Kuroshiro()
kuroshiro.init(new KuromojiAnalyzer())

const fetchProxy = () => {
    return new Promise((resolve, reject) => {
      var availableProxys = [];
      const options = {
        url: "https://free-proxy-list.net/"
      };
  
      request.get(options, (error, response, body) => {
        if (!error) {
          const $ = cheerio.load(body);
          const proxyWrappers = $('[class="table table-striped table-bordered"]').children('tbody').children('tr')
          proxyWrappers.each((index, element) => {
            const info = $(element).children();
            if (info.eq(5).text() === 'yes') {
              const newProxyURL = `http://${info.eq(0).text()}:${info.eq(1).text()}`
              availableProxys.push(new HttpProxyAgent(newProxyURL))
            }
          })
          resolve(availableProxys);
        } else {
          console.log("fetch failed...");
          reject(error);
        }
      });
    });
  };


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

    const availableProxys = await fetchProxy();
    // try another proxy if the current one doesn't work
    while (proxyID < 10) {           // try 10 proxys only
    // while (proxyID < availableProxys.length) {
        try {
            const response = await getResponseProxy(availableProxys[proxyID]);
            result = response;
            break;
        } catch (error) {
            console.log(`Proxy ${proxyID} failed. Trying next proxy...`);
            proxyID++;
            continue;
        }
    }
    
    console.log(`Translation found by Proxy ${proxyID}`);
    res.send(result)
    }
);

// enable cors 
router.use(cors());

module.exports = router;