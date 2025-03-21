const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');

// Need to write tests here.

chai.use(chaiHttp);

suite('Functional Tests', () =>{

    describe('Get a single stock',function done(){
    // Test 1: Get a Stock
        it('should successfully query the api', ()=>{
            chai.request(server).get("/api/stock-prices").query({
                stock: 'AAPL'
            }).end((err,result) =>{
                assert.equal(result.status, 200);
                expect(result.body).to.be.a('object');
                expect(result.body).to.have.property('stockData');
                expect(result.body.stockData).to.have.property('price');
                expect(result.body.stockData).to.have.property('stock');
                expect(result.body.stockData).to.have.property('likes');
                assert.equal(result.body.stockData.likes, 0);
                done();
            });
        });
    // Test 2: Get a Stock and Like It
        it('should successfully like the stock', ()=>{
            chai.request(server).get("/api/stock-prices").query({
                stock: 'GOOG',
                like: 'true'
            }).end((err,result) =>{
                assert.equal(result.status, 200);
                expect(result.body).to.be.a('object');
                expect(result.body).to.have.property('stockData');
                expect(result.body.stockData).to.have.property('price');
                expect(result.body.stockData).to.have.property('stock');
                expect(result.body.stockData).to.have.property('likes');
                assert.equal(result.body.stockData.likes, 1);
                done();
            });
        });
    // Test 3: Get the Same Stock and Like It Again
        it('should successfully like the stock and not increase the likes', ()=>{
            chai.request(server).get("/api/stock-prices").query({
                stock: 'GOOG',
                like: 'true'
            }).end((err,result) =>{
                assert.equal(result.status, 200);
                expect(result.body).to.be.a('object');
                expect(result.body).to.have.property('stockData');
                expect(result.body.stockData).to.have.property('price');
                expect(result.body.stockData).to.have.property('stock');
                expect(result.body.stockData).to.have.property('likes');
                assert.equal(result.body.stockData.likes, 1);
                done();
            });
        });
    });
    describe('Get two Stocks', function done(){
        // Test 4: Get Two Stocks
        
        it('should successfully query the api for two stocks', ()=>{
            chai.request(server).get("/api/stock-prices?stock=GOOG&stock=MSFT").end((err,result) =>{
                assert.equal(result.status, 200);
                expect(result.body).to.be.a('object');
                expect(result.body).to.have.property('stockData');
                expect(result.body.stockData).to.be.a('Array');
                expect(result.body.stockData[0]).to.have.property('price');
                expect(result.body.stockData[0]).to.have.property('stock');
                expect(result.body.stockData[0]).to.have.property('rel_likes');
                expect(result.body.stockData[1]).to.have.property('price');
                expect(result.body.stockData[1]).to.have.property('stock');
                expect(result.body.stockData[1]).to.have.property('rel_likes');
                done();
            });
        });

        // Test 5: Get Two Stocks and Like Them
        it('should successfully like the stocks', ()=>{
            chai.request(server).get("/api/stock-prices?stock=AAPL&stock=MSFT").end((err,result) =>{
                assert.equal(result.status, 200);
                expect(result.body).to.be.a('object');
                expect(result.body).to.have.property('stockData');
                expect(result.body.stockData).to.be.a('Array');
                expect(result.body.stockData[0]).to.have.property('price');
                expect(result.body.stockData[0]).to.have.property('stock');
                expect(result.body.stockData[0]).to.have.property('rel_likes');
                expect(result.body.stockData[1]).to.have.property('price');
                expect(result.body.stockData[1]).to.have.property('stock');
                expect(result.body.stockData[1]).to.have.property('rel_likes');
                done();
            });
        });
    })

});
