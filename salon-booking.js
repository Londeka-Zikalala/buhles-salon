export default function salonBooking(db) {
//function to find all data for stylist 
async function findStylist(phoneNumber){
    //returns all the rows/columns in the stylist table associated with the number
    try{
        let stylist = await db.manyOrNone('SELECT * FROM stylist WHERE phone_number = $1', [phoneNumber]);
        return stylist
    }catch(error){
        console.error(error.message)
        return 'stylist not found'
    }
  
}
//function to find a specif client 
async function findClient(phoneNumber){
    //returns all the rows/columns associated with the phoneNumber 
    try{
let client = await db.manyOrNone('SELECT * FROM client WHERE phone_number = $1',[phoneNumber]);
return client
    }
    catch(error){
        console.error(error.message)
        return 'client not found'
    }
}
//function to find a specific treatment
async function findTreatment(code){
    try{
        //return all the rows/columns associated with the code
        let treatment =await db.manyOrNone('SELECT * FROM treatment WHERE code = $1', [code]);
        return treatment
    }catch(error){
        console.error(error.message)
        return 'treatment not found'
    }
}
//function to find all treatments 
async function findAllTreatments(){
    //returns all the data from the table 
    try{
        let allTreatments = await db.manyOrNone('SELECT * FROM treatment')
        return allTreatments
    }
    catch(error){
        console.error(error.message)
    }
}
//function to make a booking 
async function makeBooking(clientId, treatmentId, stylistId, date, time){
  try{

   //get all the bookings
    let bookings = await db.manyOrNone(`SELECT * FROM booking WHERE booking_date = $1 AND booking_time = $2`,[date, time]);
    //store the treatment and stylist 
    let treatment = [];
    let stylist = []
    //iterate the bookings array
    for(let i = 0; i < bookings.length; i++){
        //get matching id
        if(bookings[i].treatment_id === Number(treatmentId)){
            //push it to the treatment array
            stylist.push(bookings[i]);
        }
        //get matching stylist_id
        if(bookings[i].stylist_id === Number(stylistId)){
            //push it to the stylist array
           treatment.push(bookings[i]);
        }
    }
    if(treatment.length >=2){
        return 'This treatment is fully booked at the selected time. Please choose another time or treatment.';
    }
    if(stylist.length >= 1){
        return 'This stylist is already booked at the selected time. Please choose another time or stylist.';
    }
//insert the new booking
    await db.none('INSERT INTO booking (booking_date, booking_time, client_id, treatment_id, stylist_id) VALUES ($1, $2, $3, $4, $5)', [date, time, clientId, treatmentId, stylistId]);

    return 'Booking successful!';
  }catch(error){
    console.error(error.message)
    
}
}

//function to find all bookings for a specific day
async function findAllBookings(){
    try{
        //Fetch all bookings using the date as a filter
        let bookigsForDay = await db.manyOrNone(`SELECT * FROM booking`) ;
        return bookigsForDay
    }catch(error){
    console.error(error.message)
}
}
// function to find a client's booking 
async function findClientBookings(clientId){
try{
    //Fetch all bookings using client id as filter 
    let bookingsByClient = await db.manyOrNone(`SELECT * FROM booking WHERE client_id = $1`, [clientId])

    return bookingsByClient
}catch(error){
    console.error(error.message)
}
}
//find all bookings for a specific date
async function findAllBookingsForDay(date){
    try{
        let bookigs = await db.manyOrNone(`SELECT * FROM booking WHERE booking_date = $1`, [date])
        return bookigs
    }
    catch(error){
        console.error(error.message)
    }
}

async function findAllBookingsFiltered({day, time}){
    try{
        let booking;
        if(day !== null || time !== null ){
             booking = await db.manyOrNone('SELECT * FROM booking WHERE booking_date = $1 OR booking_time = $2', [day, time]);
        }
        else if(day !== null && time !== null){
            booking = await db.manyOrNone('SELECT * FROM booking WHERE booking_date = $1 AND booking_time = $2', [day, time])
        }
        return booking
    }
    catch(error){
        console.error(error.message)
    }
}

async function totalIncomeForDay(date){
    try{
        // use the SUM function to get the sum of the  and Join the booking table with the treatment table to get price.
        let totalIncome = await db.oneOrNone(`SELECT SUM(treatment.price) as total_income
        FROM treatment 
        JOIN booking ON treatment.id = booking.treatment_id WHERE booking.booking_date = $1`,[date]);;
      
        return totalIncome.total_income
    } catch(error){
        console.error(error.message)
    }
}

async function mostValuableClient(){
    try{
        // select the sum of the treatment price and group by the customer id and then order by the total paid in descending order. 
        let highestPaying = await db.manyOrNone(` SELECT SUM(treatment.price) as total_paid, booking.client_id as c
        FROM treatment 
        JOIN booking on treatment.id = booking.treatment_id
        GROUP BY booking.client_id
        ORDER BY total_paid DESC
        LIMIT 1`)
       
        return highestPaying[0].c
    } catch(error){
        console.error(error.message)
    }
}

async function totalCommission(date, stylistId){
    try{
        //Get the price of the treatment 
        //Then calculate for when the stylist is booked
        //I will need a join to get the commission and the price
        let stylistTotalAndCommission = await db.manyOrNone(`SELECT SUM(treatment.price) AS total, stylist.commission_percentage AS cp
        FROM treatment
        JOIN booking on treatment.id = booking.treatment_id
        JOIN stylist on booking.stylist_id = stylist.id
        WHERE booking.booking_date = $1 AND booking.stylist_id = $2
        GROUP BY booking.stylist_id, stylist.commission_percentage`, [date, stylistId]); 

    let totalCommission = stylistTotalAndCommission[0].cp * stylistTotalAndCommission[0].total

        console.log(stylistTotalAndCommission);
        console.log(totalCommission)
        return totalCommission
    }catch(error){
        console.error(error.message)
    }
}
    return {
        findStylist,
        findClient,
        findTreatment,
        findAllTreatments,
        makeBooking,
        findAllBookings,
        findClientBookings,
        findAllBookingsForDay,
        findAllBookingsFiltered,
        totalIncomeForDay,
        totalCommission,
        mostValuableClient
    }
}  
// `SELECT booking.id, booking.client_ide, booking.treatment_id,booking.stylist_id,booking.booking_date, booking.booking_time,
//         client.first_name AS client_first_name, client.last_name AS client_last_name, 
//         treatment.type AS treatment_type, 
//         stylist.first_name AS stylist_first_name, stylist.last_name AS stylist_last_name 
//         FROM booking 
//         JOIN client ON booking.client_id = client.id 
//         JOIN treatment ON booking.treatment_id = treatment.id 
//         JOIN stylist ON booking.stylist_id = stylist.id