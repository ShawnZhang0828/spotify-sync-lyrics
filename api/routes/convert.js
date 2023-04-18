//TODO: finish up this route

const Kuroshiro = require("kuroshiro")
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji")


const express = require('express');
const router = express.Router();
const cors = require('cors');

const kuroshiro = new Kuroshiro()

kuroshiro.init(new KuromojiAnalyzer())

    // kuroshiro.init(new KuromojiAnalyzer())
    //     .then(function(){
    //         return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    //     })
    //     .then(function(result){
    //         console.log(result);
    //     })



router.get('/line', async (req, res) => {
    const data = req.query.data;
    var result;

    try {
        result = await kuroshiro.convert(data, { to: "hiragana" });
    } catch (error) {
        result = "converted failed at " + data; 
    }
    
    res.send(result)

    }
);

// refresh access token using spotify API
router.get('/refresh_token', function(req, res) {
    }
);

// enable cors 
router.use(cors());

module.exports = router;