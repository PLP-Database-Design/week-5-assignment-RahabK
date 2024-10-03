// Declare dependancies/variables
const express = require('express')
const app = express()
const mysql = require('mysql2')
const dotenv = require('dotenv')
const path = require('path');

dotenv.config()
app.use(express.json())
app.set('view engine', 'ejs');
// app.set('views', __dirname='/views');
app.set('views', path.join(__dirname, 'views'));

// Create connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

  });

  // Test connection
db.connect((err) => {
    // Connection not successful
    if (err) {
      return console.error('Database connection failed:', err.stack)
    }
    // connection is successful
    console.log('Connected to the database successfully as Id:', db.threadId)
  })
  
  //  A `GET' endpoint and retrieve from Patients
  app.get('/patients', (req, res) => {
    const getpatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query(getpatients, (err,data) => {
        // if I have an error
      if (err) {
        return res.status(400).send('Failed to get patients')
      }
      else{
         //Display the records to the browser 
      res.status(200).render('patients',{patients: data})
      }
    })
  })

  //Retrieve all providers
  app.get('/providers', (req, res) => {
    const getproviders = " SELECT first_name, last_name,provider_specialty FROM providers"
    db.query(getproviders, (err,data) => {
        // if I have an error
      if (err) {
        return res.status(400).send('Failed to get providers')
      }
      else{
         //Display the records to the browser 
      res.status(200).render('providers',{data: data})
      }
    })
  })
    
// Filter patients by First Name
   app.get('/patients/first_name/:firstName', (req, res) => {
    const firstName = req.params.firstName
     const getpatients = 'SELECT * FROM patients WHERE first_name = ?'
     db.query(getpatients, [firstName], (err, data) => {
        // if I have an error
        if (err) {
            return res.status(400).send('Failed to get firstName from patients')
        }
        else{
         //Display the records to the browser 
      res.status(200).render('patients_firstName',{patients: data})
      }
    })
  })

  //Retrieve all providers by their specialty
  app.get('/providers/provider_specialty/:ProviderSpecialty', (req, res) => {
    const provider_specialty = req.params.ProviderSpecialty; 
    db.query('SELECT * FROM providers WHERE provider_specialty = ?', [provider_specialty], (err, data) => {
 // if I have an error
 if (err) {
    return res.status(400).send('Failed to get provider by specialty')
        }
        else{
         //Display the records to the browser 
         res.status(200).render('provider_specialty', { data: data })
      }
    })
  })


   // listen to the serverno\
   const PORT = 3300
   app.listen(3300, () => {
     console.log(`server is runnig on http://localhost:${PORT}`)
   })