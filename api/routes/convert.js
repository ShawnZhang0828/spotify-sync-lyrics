const Kuroshiro = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

const { translate } = require("@vitalets/google-translate-api");
const axios = require("axios");
const cheerio = require("cheerio");

const express = require("express");
const router = express.Router();
const cors = require("cors");

var HttpProxyAgent = require("http-proxy-agent");
const AbortController = require("abort-controller");

// initialize hiragana converter
const kuroshiro = new Kuroshiro();
kuroshiro.init(new KuromojiAnalyzer());

var activeRequests = [];
var validProxy = null;

const fetchProxy = () => {
  return new Promise((resolve, reject) => {
    var availableProxys = [];
    const options = {
      url: "https://free-proxy-list.net/",
    };

    axios.get(options.url).then(response => {
      const $ = cheerio.load(response.data);
      const proxyWrappers = $('[class="table table-striped table-bordered"]')
          .children("tbody")
          .children("tr");
        proxyWrappers.each((index, element) => {
          const info = $(element).children();
          
          if (info.eq(5).text() === "yes" && (info.eq(2).text() === "US" || info.eq(2).text() === "CA")) {
            const newProxyURL = `http://${info.eq(0).text()}:${info
              .eq(1)
              .text()}`;
            availableProxys.push(new HttpProxyAgent(newProxyURL));
          }
        });
        resolve(availableProxys);
    }).catch(error => {
      console.log("fetch proxies for translation failed...");
      reject(error);
    })
  });
};

router.get("/hiragana", async (req, res) => {
  const data = req.query.data;
  var result;

  try {
    result = await kuroshiro.convert(data, {
      to: "hiragana",
    });
  } catch (error) {
    result = "converted failed at " + data;
  }

  res.send(result);
});

// refresh access token using spotify API
router.get("/translate", async (req, res) => {
  const data = req.query.data;
  var result;
  var proxyID = 0;

  // abort the previous request if it's still running
  if (activeRequests.length > 0) {
    activeRequests.forEach(request => {
        request.abort(); 
    });

    activeRequests = [];
    
    console.log("Previous request aborted");
  }

  // create a new AbortController for the current request
  const controller = new AbortController();
  const signal = controller.signal;
  activeRequests.push(controller);

  // function to get response from the google translate api
  const getResponseProxy = async (agent) => {
    response = await translate(data, {
      to: "zh-cn",
      fetchOptions: { agent, timeout: 3000 },
    });
    return response;
  };

  // try the proxy that was valid last time
  if (validProxy !== null) {
    try {
        console.log("Trying previously valid proxy...");
        const response = await getResponseProxy(validProxy, signal);
        result = response;

        console.log("Proxy still valid.");
        res.send(result);
        return ;
    } catch (error) {
        validProxy = null;
        console.log("Proxy no longer available, finding new ones...");
    }
  }

  const availableProxys = await fetchProxy();
  // try another proxy if the current one doesn't work
  while (proxyID < 10) {
    // try 10 proxys only
    try {
      if (signal.aborted) {
        return null;
      }
      const response = await getResponseProxy(availableProxys[proxyID], signal);
      result = response;
      validProxy = availableProxys[proxyID];
      break;
    } catch (error) {
        console.log(error.message);
      console.log(`Proxy ${proxyID} failed. Trying next proxy...`);
      proxyID++;
      continue;
    }
  }

  console.log(`Translation found by Proxy ${proxyID}`);
  res.send(result);
});

// enable cors
router.use(
  cors({
    origin: "http://localhost:4000", // Allow only this origin
    methods: "GET,POST", // Allowed methods
  })
);

module.exports = router;
