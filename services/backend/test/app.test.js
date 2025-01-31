import { server, closeDBConnection } from '../app.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import mongoose from 'mongoose';
import supertest from 'supertest';

const request = supertest(server);

describe('Test app.js endpoints', () => {
    let firstCommodity, lastCommodity;
    
    before((done) => {
        mongoose.connection.once('open', () => {
            done();
        });
        
        mongoose.connection.on('error', (err) => {
            done();
        });
    });

    after(async () => {
        closeDBConnection();
    });

    describe('Should succeed', () => {
        it('should retrieve all Commodities', async () => {
            const response = await request.get('/commodities');
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');

            firstCommodity = response.body[0];
            lastCommodity = response.body[response.body.length - 1];
        });

        it('should retrieve one Commodity by id', async () => {
            const response = await request.get(`/commodities/${firstCommodity.id}`);
            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal(firstCommodity.id);
            expect(response.body._id).to.equal(firstCommodity._id);
        });

        it('should update one Commodity by id', async () => {
            const newVariety = firstCommodity.variety + 'a';
            
            const response = await request.post(`/commodities/${firstCommodity.id}`)
                .send({
                    plu: firstCommodity.plu,
                    category: firstCommodity.category,
                    commodity: firstCommodity.commodity,
                    variety: newVariety,
                    size: firstCommodity.size,
                    botanical: firstCommodity.botanical,
                    aka:firstCommodity.akag
                });
            expect(response.status).to.equal(200);
            expect(response.body.variety).to.equal(newVariety);
            expect(response.body.id).to.equal(firstCommodity.id);
            expect(response.body._id).to.equal(firstCommodity._id);
        });

        it('should delete one Commodity by id', async () => {
            const response = await request.delete(`/commodities/${firstCommodity.id}`);
            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal(firstCommodity.id);
            expect(response.body._id).to.equal(firstCommodity._id);
        });

        it('should create one Commodity', async () => {
            const response = await request.post('/commodities/')
                .send({
                    plu: firstCommodity.plu,
                    category: firstCommodity.category,
                    commodity: firstCommodity.commodity,
                    variety: firstCommodity.variety,
                    size: firstCommodity.size,
                    botanical: firstCommodity.botanical,
                    aka:firstCommodity.akag
                });
            expect(response.status).to.equal(200);
            expect(response.body.variety).to.equal(firstCommodity.variety);
            expect(response.body.id).to.be.a('string');
            expect(response.body._id).to.be.a('string');
        });
    });

    describe('Should fail with non-existent id (404)', () => {
        it('should not retrieve Commodity by id', async () => {
            const response = await request.get(`/commodities/${firstCommodity.id}`);
            expect(response.status).to.equal(404);
        });

        it('should not update Commodity by id', async () => {
            const newVariety = firstCommodity.variety + 'a';

            const response = await request.post(`/commodities/${firstCommodity.id}`)
                .send({
                    plu: firstCommodity.plu,
                    category: firstCommodity.category,
                    commodity: firstCommodity.commodity,
                    variety: newVariety,
                    size: firstCommodity.size,
                    botanical: firstCommodity.botanical,
                    aka:firstCommodity.akag
                });
            expect(response.status).to.equal(404);
        });

        it('should not delete Commodity by id', async () => {
            const response = await request.delete(`/commodities/${firstCommodity.id}`);
            expect(response.status).to.equal(404);
        });
    });

    describe('Should fail with invalid id (400)', () => {
        it('should not retrieve Commodity by id', async () => {
            const response = await request.get("/commodities/12345");
            expect(response.status).to.equal(400);
        });

        it('should not update Commodity by id', async () => {
            const newVariety = firstCommodity.variety + 'a';

            const response = await request.post("/commodities/12345")
                .send({
                    plu: firstCommodity.plu,
                    category: firstCommodity.category,
                    commodity: firstCommodity.commodity,
                    variety: newVariety,
                    size: firstCommodity.size,
                    botanical: firstCommodity.botanical,
                    aka:firstCommodity.akag
                });
            expect(response.status).to.equal(400);
        });

        it('should not delete Commodity by id', async () => {
            const response = await request.delete("/commodities/12345");
            expect(response.status).to.equal(400);
        });
    });

    describe('Should fail with invalid data (500)', () => {
        it('should not update Commodity by id', async () => {
            const newVariety = firstCommodity.variety + 'a';

            const response = await request.post(`/commodities/${lastCommodity.id}`)
                .send({
                    plu: "Invalid PLU",
                    category: firstCommodity.category,
                    commodity: firstCommodity.commodity,
                    variety: newVariety,
                    size: firstCommodity.size,
                    botanical: firstCommodity.botanical,
                    aka:firstCommodity.akag
                });
            expect(response.status).to.equal(500);
        });
    });
});