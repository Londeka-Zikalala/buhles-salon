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
    this.timeout(15000)
    beforeEach(async function () {

        await db.none(`TRUNCATE booking RESTART IDENTITY CASCADE`);

    });
    
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

        const bookings = await booking.findClientBookings(client.id);
        console.log(bookings);
        assert.equal('Booking successful!', makeAbooking);
        
    });

    it("should be able to get all bookings", async function(){
        const client1 = await booking.findClient("071 195 4894");
        const client2 = await booking.findClient("073 185 3893");
        
        const stylist1 = await booking.findStylist("073 125 2388");
        const stylist2 = await booking.findStylist("073 025 2388")


        const treatment1 = await booking.findTreatment("111");
        const treatment2 = await booking.findTreatment("333");
        const treatment3 = await booking.findTreatment("444");

        const date = '2023-11-23';
        const time = '10:00';

        await booking.makeBooking(client1[0].id, treatment1[0].id, stylist1[0].id, date, time);
        await booking.makeBooking(client1[0].id, treatment2[0].id, stylist1[0].id, date, time);
        await booking.makeBooking(client2[0].id, treatment3[0].id, stylist2[0].id, date, time);

        const allBookings = await booking.findAllBookings()
        
        assert.deepEqual( [
            {
            "booking_date": new Date('2023-11-22T22:00:00.000Z'),
              "booking_time": "10:00:00",
              "client_id": 4,
              "id": 1,
              "stylist_id": 2,
              "treatment_id": 1
            },
            {
             "booking_date": new Date('2023-11-22T22:00:00.000Z'),
              "booking_time": "10:00:00",
              "client_id": 4,
              "id": 2,
              "stylist_id": 2,
              "treatment_id": 3
            },
            {
             "booking_date": new Date('2023-11-22T22:00:00.000Z'),
              "booking_time": "10:00:00",
              "client_id": 3,
              "id": 3,
              "stylist_id": 3,
              "treatment_id":4
            }
            ]
              ,
              allBookings  )
    });
    

    it("should be able to get client booking(s)", async function () {


        const client1 = await booking.findClient("071 195 4894");
        const client2 = await booking.findClient("073 185 3893");

        const stylist1 = await booking.findStylist("073 125 2388");
        const stylist2 = await booking.findStylist("073 025 2388")


        const treatment1 = await booking.findTreatment("111");
        const treatment2 = await booking.findTreatment("333");
        const treatment3 = await booking.findTreatment("444");

        const date = new Date('2023-11-23');
        const time = '10:00';
        await booking.makeBooking(client1[0].id, treatment1[0].id, stylist1[0].id, date, time);
        await booking.makeBooking(client1[0].id, treatment2[0].id, stylist1[0].id, date, time);
        await booking.makeBooking(client2[0].id, treatment3[0].id, stylist2[0].id, date, time);

        const clientBooking1 = await booking.findClientBookings(client1[0].id);
        const clientBooking2 = await booking.findClientBookings(client2[0].id);
        assert.deepEqual([
            {
              booking_date: new Date('2023-11-22T22:00:00.000Z'),
              booking_time: '10:00:00',
              client_id: 4,
              id: 1,
              stylist_id: 2,
              treatment_id: 1
            },
            {
              booking_date: new Date('2023-11-22T22:00:00.000Z'),
              booking_time: '10:00:00',
              client_id: 4,
              id: 2,
              stylist_id: 2,
              treatment_id: 3
            }
          ]
          , clientBooking1)
        assert.deepEqual([
            {
              booking_date: new Date('2023-11-22T22:00:00.000Z'),
              booking_time: '10:00:00',
              client_id: 3,
              id: 3,
              stylist_id: 3,
              treatment_id: 4
            }
          ]
          , clientBooking2)

    })

      
    it("should be able to get bookings for a date", async function () {
        const client1 = await booking.findClient("071 195 4894");
        const client2 = await booking.findClient("073 185 3893");

        const stylist1 = await booking.findStylist("073 125 2388");
        const stylist2 = await booking.findStylist("073 025 2388")


        const treatment1 = await booking.findTreatment("111");
        const treatment2 = await booking.findTreatment("333");
        const treatment3 = await booking.findTreatment("444");

        const date1 = new Date('2023-11-23');
        const date2 = new Date('2023-11-25');
        const time = '10:00';
        await booking.makeBooking(client1[0].id, treatment1[0].id, stylist1[0].id, date1, time);
        await booking.makeBooking(client1[0].id, treatment2[0].id, stylist1[0].id, date2, time);
        await booking.makeBooking(client2[0].id, treatment3[0].id, stylist2[0].id, date2, time);

        const bookings1 = await booking.findAllBookingsForDay(date1);
        const bookings2 = await booking.findAllBookingsForDay(date2);


        assert.deepEqual(
            [
              {
                booking_date: new Date('2023-11-22T22:00:00.000Z'),
                booking_time: '10:00:00',
                client_id: 4,
                id: 1,
                stylist_id: 2,
                treatment_id: 1
              }], bookings1);
        assert.deepEqual([
            {
              booking_date: new Date('2023-11-24T22:00:00.000Z'),
              booking_time: '10:00:00',
              client_id: 4,
              id: 2,
              stylist_id: 2,
              treatment_id: 3
            },
            {
              booking_date: new Date('2023-11-24T22:00:00.000Z'),
              booking_time: '10:00:00',
              client_id: 3,
              id: 3,
              stylist_id: 3,
              treatment_id: 4
            }
          ], bookings2)
        


    });
    it("should be able to get bookings for a date or time", async function () {

        const client1 = await booking.findClient("071 195 4894");
        const client2 = await booking.findClient("073 185 3893");

        const stylist1 = await booking.findStylist("073 125 2388");
        const stylist2 = await booking.findStylist("073 025 2388")


        const treatment1 = await booking.findTreatment("111");
        const treatment2 = await booking.findTreatment("333");
        const treatment3 = await booking.findTreatment("444");

        const date1 = new Date('2023-11-23');
        const date2 = new Date('2023-11-25');
        const time1 = '10:00';
        const time2 = '12:30';
        await booking.makeBooking(client1[0].id, treatment1[0].id, stylist1[0].id, date1, time1);
        await booking.makeBooking(client1[0].id, treatment2[0].id, stylist1[0].id, date2, time2);
        await booking.makeBooking(client2[0].id, treatment3[0].id, stylist2[0].id, date2, time1);

        const bookingsWithTime = await booking.findAllBookingsFiltered({day:null, time:time1});
        const bookingsWithDay = await booking.findAllBookingsFiltered({day:date1 ,time:null});
        const bookingsWithDayAndTime = await booking.findAllBookingsFiltered({day:date2,time:time2});
        assert.deepEqual([
            {
              booking_date: new Date('2023-11-22T22:00:00.000Z'),
              booking_time: '10:00:00',
              client_id: 4,
              id: 1,
              stylist_id: 2,
              treatment_id: 1
            },
            {
              booking_date: new Date('2023-11-24T22:00:00.000Z'),
              booking_time: '10:00:00',
              client_id: 3,
              id: 3,
              stylist_id: 3,
              treatment_id: 4
            }
          ]
          
          , bookingsWithTime);
        assert.deepEqual(
          [
        {
          booking_date: new Date('2023-11-22T22:00:00.000Z'),
          booking_time: '10:00:00',
          client_id: 4,
          id: 1,
          stylist_id: 2,
          treatment_id: 1
        }
      ]
      , bookingsWithDay);
        assert.deepEqual(       
[
    {
      booking_date:new Date('2023-11-24T22:00:00.000Z'),
      booking_time: '12:30:00',
      client_id: 4,
      id: 2,
      stylist_id: 2,
      treatment_id: 3
    },
    {
      booking_date: new Date('2023-11-24T22:00:00.000Z'),
      booking_time: '10:00:00',
      client_id: 3,
      id: 3,
      stylist_id: 3,
      treatment_id: 4
    }
  ] ,bookingsWithDayAndTime);

    });

    it("should be able to find the total income for a day", async function() {
        const client1 = await booking.findClient("071 195 4894");
        const client2 = await booking.findClient("073 185 3893");

        const stylist1 = await booking.findStylist("073 125 2388");
        const stylist2 = await booking.findStylist("073 025 2388")


        const treatment1 = await booking.findTreatment("111");
        const treatment2 = await booking.findTreatment("333");
        const treatment3 = await booking.findTreatment("444");

        const date1 = new Date('2023-11-23');
        const date2 = new Date('2023-11-25');
        const time1 = '10:00';
        const time2 = '12:30';
        await booking.makeBooking(client1[0].id, treatment1[0].id, stylist1[0].id, date1, time1);
        await booking.makeBooking(client1[0].id, treatment2[0].id, stylist1[0].id, date2, time2);
        await booking.makeBooking(client2[0].id, treatment3[0].id, stylist2[0].id, date2, time1);

        let totalIncome = await booking.totalIncomeForDay(date2)

        assert.equal(425, totalIncome)

    })

    it("should be able to find the most valuable client", async function() {
        const client1 = await booking.findClient("071 195 4894");
        const client2 = await booking.findClient("073 185 3893");

        const stylist1 = await booking.findStylist("073 125 2388");
        const stylist2 = await booking.findStylist("073 025 2388")


        const treatment1 = await booking.findTreatment("111");
        const treatment2 = await booking.findTreatment("333");
        const treatment3 = await booking.findTreatment("444");

        const date1 = new Date('2023-11-23');
        const date2 = new Date('2023-11-25');
        const time1 = '10:00';
        const time2 = '12:30';
        await booking.makeBooking(client1[0].id, treatment1[0].id, stylist1[0].id, date1, time1);
        await booking.makeBooking(client1[0].id, treatment2[0].id, stylist1[0].id, date2, time2);
        await booking.makeBooking(client2[0].id, treatment3[0].id, stylist2[0].id, date2, time1);

        let mostValuableClient = await booking.mostValuableClient()

        assert.equal(4, mostValuableClient)

        

    })
    it("should be able to find the total commission for a given stylist", async function() {
      const client1 = await booking.findClient("071 195 4894");
      const client2 = await booking.findClient("073 185 3893");

      const stylist1 = await booking.findStylist("073 125 2388");
      const stylist2 = await booking.findStylist("073 025 2388")


      const treatment1 = await booking.findTreatment("111");
      const treatment2 = await booking.findTreatment("333");
      const treatment3 = await booking.findTreatment("444");

      const date1 = new Date('2023-11-23');
      const date2 = new Date('2023-11-25');
      const time1 = '10:00';
      const time2 = '12:30';
      await booking.makeBooking(client1[0].id, treatment1[0].id, stylist1[0].id, date1, time1);
      await booking.makeBooking(client1[0].id, treatment2[0].id, stylist1[0].id, date1, time2);
      await booking.makeBooking(client2[0].id, treatment3[0].id, stylist2[0].id, date2, time1);

      let totalCommission = await booking.totalCommission(date1, stylist1[0].id)

      assert.equal(54, totalCommission)

    })

    after(function () {
        db.$pool.end()
    });

});