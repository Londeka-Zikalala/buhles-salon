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

    return {
        findStylist,
        findClient,
        findTreatment,
        findAllTreatments,
        makeBooking,
    }
}  