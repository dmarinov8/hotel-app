const request = require('supertest');
const mongoose = require('mongoose');
const { Reservation } = require('../../models/reservation');
const { Room } = require('../../models/room');


describe('/api/reservations', () => {
    describe('GET /', () => {

        let server;

        beforeEach(() => { server = require('../../index'); }); // Open server before each test
        afterEach(async () => { 
            await Reservation.deleteMany({});
            await Room.deleteMany({});
            await server.close(); 
        });   

        it('should return all reservations', async () => {

            await Reservation.collection.insertMany([
                { 
                    guestName: 'guest1',
                    guestEmail: 'email1@mail.com',
                    guestPhone: '123456',
                    guestCountry: 'country1',   
                    checkInDate: '1/1/2019',
                    checkOutDate: '1/2/2019',
                    numberAdults: 2
                },
                { 
                    guestName: 'guest2',
                    guestEmail: 'email2@mail.com',
                    guestPhone: '234567',
                    guestCountry: 'country2',   
                    checkInDate: '1/1/2019',
                    checkOutDate: '1/2/2019',
                    numberAdults: 2
                },
            ]);

            const res = await request(server).get('/api/reservations');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.guestName === 'guest1')).toBeTruthy;
            expect(res.body.some(g => g.guestName === 'guest2')).toBeTruthy;
            expect(res.body.some(g => g.guestEmail === 'email1@mail.com')).toBeTruthy;
            expect(res.body.some(g => g.guestEmail === 'email2@mail.com')).toBeTruthy;
            expect(res.body.some(g => g.guestCountry === 'country1')).toBeTruthy;
            expect(res.body.some(g => g.guestCountry === 'country2')).toBeTruthy;
        })        
    });
    
    describe('POST /', () => {
        let server;
        let guestName;
        let guestEmail;
        let guestPhone;
        let guestCountry;
        let roomId;
        let checkInDate;
        let checkOutDate;
        let numberAdults;

        const exec = () => {
            return request(server)
            .post('/api/reservations')
            .send({ 
                guestName,
                guestEmail,
                guestPhone,
                guestCountry,   
                roomId,
                checkInDate,
                checkOutDate,
                numberAdults
            })
        }

        beforeEach(async () => { 
            server = require('../../index'); 

            guestName = 'guest1';
            guestEmail = 'email@mail.com';
            guestPhone = '12345';
            guestCountry = 'country1';   
            checkInDate = '2/2/2019';
            checkOutDate = '2/3/2019';
            numberAdults = 2;

            // Create a room
            await Room.collection.insertMany([{
                roomCode: '1', 
                roomName: 'Room1', 
                roomTypeId: mongoose.Types.ObjectId()
            }]);

            const room = await Room.findOne();
            roomId = room._id

        }); // Open server before each test

        afterEach(async () => { 
            await Reservation.deleteMany({});
            await Room.deleteMany({});
            await server.close(); 
        });   

        it('should return 400 if guestName is less than 5 long', async () => {
            guestName = '1';
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if guestName is more than 50 long', async () => {
            guestName = new Array(52).join('a');
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is not valid', async () => {
            guestEmail = '123456';
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if roomId is not an ObjectId', async () => {
            roomId = '123456';
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if there is no room with this roomId', async () => {
            roomId = mongoose.Types.ObjectId();
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if check in date is after check out date', async () => {
            checkOutDate = '1/1/2019';
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if number of guests is missing', async () => {
            numberAdults = '';
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 200 if input is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
        });

        it('should return the reservation in the body of the response', async () => { 
            const res = await exec();
    
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'guest', 'room', 'checkInDate', 'checkOutDate', 'numberAdults']));
        });

        
    });
});