const request = require('supertest');
const { RoomType } = require('../../models/roomtype');

let server;

describe('/api/roomtypes', () => {
    beforeEach(() => { server = require('../../index'); }); // Open server before each test
    afterEach(async () => { 
        await RoomType.deleteMany({});
        await server.close(); 
    });   

    describe('GET /', () => {
        it('should return all room types', async () => {
            await RoomType.collection.insertMany([
                { name: 'roomtype1' },
                { name: 'roomtype2' }
            ]);

            const res = await request(server).get('/api/roomtypes');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'roomtype1')).toBeTruthy;
            expect(res.body.some(g => g.name === 'roomtype2')).toBeTruthy;
        })
    });

    describe('POST /', () => {
        let name;

        const exec = () => {
            return request(server)
                .post('/api/roomtypes')
                // .set('x-auth-token', token)
                .send({ name });
        };

        beforeEach(() => {
            // token = new User().generateAuthToken();
            name = 'roomtype1';
        });

        it('should return 400 if roomtype is less than 5 characters', async () => {
            name = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if roomtype is more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the roomtype if it is valid', async () => {
            await exec();
            const roomType = await RoomType.find({ name: 'roomtype1' });

            expect(roomType).not.toBeNull();
        });

        it('should return the roomtype if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'roomtype1');
        });

    })

});