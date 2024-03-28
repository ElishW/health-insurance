// Use built-in Express middleware to parse JSON and URL-encoded form data
const express = require('express');
const db = require('./db_connector'); // Import your db_connector module
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Serve your HTML file
app.get('/', async (req, res) => {
    try {
        // Retrieve members from the database
         const membersList = await db.getMembers(); // Implement this function in db_connector.js

     // Render the template with data
        res.render('members.ejs', { members: membersList })
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/members/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const member = await db.getMember(id)
        const doseData = await db.getCovidInfo(id);
        console.log(doseData.doses); // Log the value of doses
        res.render('memberDetails.ejs', { member, doses: doseData.doses });
    } catch (error) {
        console.error('Error fetching vaccine doses:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/addmember', (req, res) => {
    res.render('addMember');
});

app.post('/addmember',  async(req, res) => {
    try {
        const newMemberData = {
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            identityCard: req.body.id,
            city: req.body.city,
            street: req.body.street,
            streetNumber: req.body.street_number,
            dateOfBirth: req.body.birth_date,
            telephone: req.body.telephone,
            mobilePhone: req.body.mobile
        };

        const newMember = await db.addMember(newMemberData);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/members', async (req, res) => {
    try {
        const membersList = await db.getMembers(); // Assuming getMembers() retrieves the members from the database
        res.render('members.ejs', { members: membersList}); // Pass the members data to the template
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/updatemember/:id', async (req, res) => {
    try {
        const memberId = req.params.id;
        const member = await db.getMember(memberId); // Assuming getMember() retrieves the member from the database
        res.render('addMember.ejs' ,{ member_id: memberId, member: member });
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/updatemember/:id', async (req, res) => {
    try {
        const memberId = req.params.id;
        const memberData = {
            lastName: req.body.last_name,
            firstName: req.body.first_name,
            city: req.body.city,
            street: req.body.street,
            streetNumber: req.body.street_number,
            dateOfBirth: req.body.birth_date,
            telephone: req.body.telephone,
            mobilePhone: req.body.mobile
        };

        await db.updateMember(memberId, memberData); // Assuming updateMember() updates the member in the database

        res.redirect('/');
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/deletemember/:id', async (req, res) => {
    const memberId = req.params.id;
    try {
        // Delete the member by ID using the function from db_connector
        const deletedMember = await db.deleteMember(memberId);
        if (!deletedMember) {
            return res.status(404).send('Member not found');
        }
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting member:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/addvaccine/:id', async (req, res) => {
    const memberId = req.params.id;

    try {
        // Get vaccine information for the member ID
        //const vaccineInfo = await db.addVaccine(memberId);
        res.render('addVaccineInjection');

        // if (!vaccineInfo) {
        //     // No vaccine information found for the member
        //     return res.send('No vaccine information found for this member.');
        // }
        //
        // const { min_date, dose, vaccines } = vaccineInfo;
        //
        // if (dose === null) {
        //     return res.send('Maximum number of doses already registered for this member.');
        // }

        // res.render('addVaccineInjection.ejs')//, { id: memberId, dose, min_date, vaccines });
    } catch (error) {
        console.error('Error fetching vaccine:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/addvaccine', async (req, res) => {
    const doseInfo = {
        memberId: req.body.memberId,
        numberInjection: req.body.numberInjection,
        manufacturer:req.body.manufacturer,
        injectionDate:req.body.injectionDate
    };

    try {
        await db.addVaccine(doseInfo);
        res.redirect('/');
    } catch (error) {
        console.error('Error adding vaccine:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});