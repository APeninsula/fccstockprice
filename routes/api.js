'use strict';
const bCrypt = require('bcrypt');
const saltRounds = 12;
const stockMap = new Map();

var getLikeCount = function(symbol){
  var symbolIpList = stockMap.get(symbol);
  return !!symbol && symbolIpList? symbolIpList.length : 0;
};
var getStockLikeDiff = function(symbols){
  var likeCount1 = getLikeCount(symbols[0]);
  var likeCount2 = getLikeCount(symbols[1]);
  return[likeCount1-likeCount2,likeCount2-likeCount1];
};
var calculateStockData = function(symbols,sPrice,isDiff){
  if(isDiff){
    const likeDiffs = getStockLikeDiff(symbols);
    return [
        {stock:symbols[0],price:sPrice[0],rel_likes:likeDiffs[0]},
        {stock:symbols[1],price:sPrice[1],rel_likes:likeDiffs[1]}
      ];
  } else {
    return {
      stock:symbols[0],price:sPrice[0],likes:getLikeCount(symbols[0])
    };
  }
};

var isIpAlreadyStored = function(array,ip){
  return array.some(el=>bCrypt.compareSync(ip,el));
};

var likeStocks = function(symbols, ip){
    symbols.forEach(element => {
      if(!stockMap.has(element)){
        stockMap.set(element,[bCrypt.hashSync(ip, saltRounds)]);
      }
      else{
        var stockLikes = stockMap.get(element);
        if(isIpAlreadyStored(stockLikes,ip)){
          return;
        }
        stockLikes.push(bCrypt.hashSync(ip, saltRounds));
        stockMap.set(element,stockLikes);
      }
    });
    return;
};

module.exports = function (app) {
  // Not going to serialize or store the data for this project
  app.route('/api/stock-prices')
    .get(function (req, res){
      const isArrayOfSymbols = Array.isArray(req.query.stock);
      const symbolsArray = isArrayOfSymbols? req.query.stock: new Array(req.query.stock);
      const isLiked= req.query.like || "false";
      if(isLiked === 'true'){
        likeStocks(symbolsArray, req.ip);
      }
      if(!isArrayOfSymbols){
        fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbolsArray[0]}/quote`).then(result=>result.json()).then(result=>{
          try{
            const stockPrice = [result.latestPrice];            
            const stockData = calculateStockData(symbolsArray, stockPrice, isArrayOfSymbols);
            res.json({
              stockData
            });
          }catch(error){
            console.error(error);
          };
          
    });} else{
        const fetchStock1 = fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbolsArray[0]}/quote`).then(result=>result.json());
        const fetchStock2 = fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbolsArray[1]}/quote`).then(result=>result.json());
        Promise.all([fetchStock1,fetchStock2]).then( (data)=>{
            try {
              const stockPrices = [data[0].latestPrice,data[1].latestPrice];
              const stockData = calculateStockData(symbolsArray, stockPrices, isArrayOfSymbols);
              res.json({
                stockData
              });
            } catch (error) {
              console.error(error);
            }
        });
    }
    });
};
