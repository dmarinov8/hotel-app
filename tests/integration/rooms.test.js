const request = require('supertest');
const mongoose = require('mongoose');
const { Room } = require('../../models/room');
const { RoomType } = require('../../models/roomtype');

let server;

describe('/api/rooms', () => {
    beforeEach(() => { server = require('../../index'); }); // Open server before each test
    afterEach(async () => { 
        await Room.deleteMany({});
        await server.close(); 
    });   

    describe('GET /', () => {
        it('should return all rooms', async () => {
            await Room.collection.insertMany([
                { roomCode: 'code1', roomName: 'room1' },
                { roomCode: 'code2', roomName: 'room2' }
            ]);

            const res = await request(server).get('/api/rooms');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.roomCode === 'code1')).toBeTruthy;
            expect(res.body.some(g => g.roomCode === 'code2')).toBeTruthy;
        })
    });

    describe('POST /', () => {
        let server;
        let roomCode;
        let roomName;
        let roomTypeName;
        let roomTypeId;
        let roomType;
        let room;

    
        let exec = () => {
            return request(server)
                .post('/api/rooms')
                // .set('x-auth-token', token)
                .send({ roomCode, roomName, roomTypeName });
        };
    
        beforeEach(async () => { 
            server = require('../../index'); 
            roomCode = 'roomcode1';
            roomName = 'roomName1';
            roomTypeName = 'roomTypeName1';
            
            roomTypeId = mongoose.Types.ObjectId();
    
            roomType = new RoomType({
                _id: roomTypeId,
                name: roomTypeName,
                numberOfUnits: 10
            });
            

            await roomType.save();
               
            // token = new User().generateAuthToken();
    
        }); // Open server before each test
        
        afterEach(async () => { 
            await RoomType.deleteMany({});
            await Room.deleteMany({});
            await server.close(); 
        });    
    
        it('should return 400 if roomCode is less than 1 characters', async () => {
            roomCode = '';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if roomCode is more than 10 characters', async () => {
            roomCode = new Array(12).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if roomName is less than 1 characters', async () => {
            roomName = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if roomName is more than 50 characters', async () => {
            roomName = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if no valid roomTypeName is provided', async () => {
            roomTypeName = '1';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if room with this roomCode already exists', async () => {
            room = new Room({
                roomCode, 
                roomName, 
                roomType: roomTypeId
            });
            await room.save();

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 200 if room is created', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
        });

        it('should increase number of units by 1 if room is created', async () => {
            await exec();
            roomType = await RoomType.findById(roomTypeId);
            
            expect(roomType.numberOfUnits).toBe(11);
        });

        it('should return the room in body of response', async () => { 
            const res = await exec();
    
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['roomCode','roomName','roomType']));
        });

    })

});