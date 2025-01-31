import { server, closeDBConnection } from '../app.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import mongoose from 'mongoose';
import supertest from 'supertest';

const request = supertest(server);

describe('App', () => {
    let firstCommodity;

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

    it('should retrieve all Commodities', async () => {
        const response = await request.get('/commodities');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');

        firstCommodity = response.body[0];
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
        firstCommodity.id = undefined;
        firstCommodity._id = undefined;

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