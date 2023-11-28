import assert from 'assert';
import SalonBooking from '../salon-booking.js';
import db from '../db.js';


// import pgPromise from 'pg-promise';

// TODO configure this to work.
// const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/salon_test";

// const config = { 
// 	connectionString : DATABASE_URL
// }

// const pgp = pgPromise();
// const db = pgp(config);

let booking = SalonBooking(db);

describe("The Booking Salon", function () {
    this.timeout(6000)
    beforeEach(async function () {

        await db.none(`delete from booking`);

    });
    
// -- DATA FOR THE CLIENTS TABLE 
// INSERT INTO client (first_name,last_name,phone_number) VALUES ('Thando', 'Nkosi', '071 165 1891');
// INSERT INTO client (first_name,last_name,phone_number) VALUES ('Martha', 'Nkosi', '072 175 2892');
// INSERT INTO client (first_name,last_name,phone_number) VALUES ('Thembi', 'Xulu', '073 185 3893');
// INSERT INTO client (first_name,last_name,phone_number) VALUES ('Xoli', 'Mgwenya', '071 195 4894');
// INSERT INTO client (first_name,last_name,phone_number) VALUES ('Thabile', 'Mondlana', '071 105 5895');
// INSERT INTO client (first_name,last_name,phone_number) VALUES ('Senamile', 'Shongwe', '071 115 6896');
// INSERT INTO client (first_name,last_name,phone_number) VALUES ('Sendzile', 'Tsabetse', '071 125 7897');

// -- DATA FOR THE STYLISTS TABLE 
// INSERT INTO stylist (first_name,last_name,phone_number, commission_percentage) VALUES ('Thabo', 'Khoza', '073 225 2388', 0.09);
// INSERT INTO stylist (first_name,last_name,phone_number, commission_percentage) VALUES ('Sam', 'Jennings', '073 125 2388', 0.15);
// INSERT INTO stylist (first_name,last_name,phone_number, commission_percentage) VALUES ('Natasha', 'Romanoff', '073 025 2388', 0.18);



// -- DATA FOR THE TREATMENTS TABLE
// INSERT INTO treatment (type, code, price ) VALUES ('pedicures', 111, 175);
// INSERT INTO treatment (type,code, price) VALUES ('manicures', 222, 215);
// INSERT INTO treatment (type,code, price) VALUES ('make_up', 333, 185);
// INSERT INTO treatment (type,code, price) VALUES ('brow_and_lashes',444, 240);
    it("should be able to list treatments", async function () {

        const treatments = await booking.findAllTreatments();
        assert.deepEqual([
            {
              code: '111',
              id: 1,
              price: '175.00',
              type: 'pedicures'
            },
            {
              code: '222',
              id: 2,
              price: '215.00',
              type: 'manicures'
            },
            {
              code: '333',
              id: 3,
              price: '185.00',
              type: 'make_up'
            },
            {
              code: '444',
              id: 4,
              price: '240.00',
              type: 'brow_and_lashes'
            }
          ]
          , treatments);
    });

    it("should be able to find a stylist", async function () {

        const stylist = await booking.findStylist("073 225 2388");
        assert.deepEqual( [
            {
              commission_percentage: '0.09',
              first_name: 'Thabo',
              id: 1,
              last_name: 'Khoza',
              phone_number: '073 225 2388'
            }
          ]
          , stylist);
    });

    it("should be able to allow a client to make a booking", async function () {
        const client = await booking.findClient("073 185 3893");
        const treatment = await booking.findTreatment(222);
        const stylist = await booking.findStylist("073 125 2388")
        const date = '2023-09-20';
        const time = '08:00';

        const makeAbooking = await booking.makeBooking(client.id, treatment.id, stylist.id, date, time);

        // const bookings = await booking.findClientBookings(client.id);
        assert.equal('Booking successful!', makeAbooking);
    });

    it("should be able to get client booking(s)", async function () {

        const client1 = await booking.findClient("***");
        const client2 = await booking.findClient("***");
        
        const treatment1 = await booking.findTreatment("***");
        const treatment2 = await booking.findTreatment("***");

        await booking.booking(treatment1.id, client1.id, date, time);
        await booking.booking(treatment2.id, client1.id, date, time);
        await booking.booking(treatment1.id, client2.id, date, time);

        const bookings = await booking.findAllBookings(client);

        assert.equal([], clientBooking)
    })

    it("should be able to get bookings for a date", async function () {
        const client1 = await booking.findClient("***");
        const client2 = await booking.findClient("***");

        const treatment1 = await booking.findTreatment("***");
        const treatment2 = await booking.findTreatment("***");

        await booking.booking(treatment1.id, client1.id, date, time);
        await booking.booking(treatment2.id, client1.id, date, time);
        await booking.booking(treatment3.id, client2.id, date, time);

        const bookings = await booking.findAllBookings({date, time});

        assert.equal([], bookings);

    });

    it("should be able to find the total income for a day", function() {
        assert.equal(1, 2);
    })

    it("should be able to find the most valuable client", function() {
        assert.equal(1, 2);
    })
    it("should be able to find the total commission for a given stylist", function() {
        assert.equal(1, 2);
    })

    after(function () {
        db.$pool.end()
    });

});