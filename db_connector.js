//const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
// Connection URI
const uri = 'mongodb://127.0.0.1:27017/covidDB'; // Change the URI as per your MongoDB configuration
//const client = new MongoClient(uri);

const memberSchema = new mongoose.Schema({
    firstName: { type: String},
    lastName: { type: String},
    identityCard: { type: String},
    city: { type: String},
    street: { type: String},
    streetNumber: { type: String},
    dateOfBirth: { type: Date},
    telephone: { type: String},
    mobilePhone: { type: String }
});
const doseSchema= new mongoose.Schema({
    MemberId: {type:String},
    numberInjection:{type:String},
    manufacturer:{type:String},
    injectionDate:{type:Date}
});
const covidSchema = new mongoose.Schema({
    MemberId: { type: String },
    contaminationDate: { type: Date },
    recoveryDate: { type: Date }
});

contaminationDate
// Create a model for the 'members' collection using the schema
const Member = mongoose.model('Member', memberSchema);
const Vaccine = mongoose.model('Vaccine', doseSchema);
const Covid = mongoose.model('Covid', covidSchema);

// Function to connect to the database
async function connectToDatabase() {
    try {
        //await client.connect();
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            //.then(() => console.log('Connected to MongoDB'))
            //.catch(err => console.error('Error connecting to MongoDB:', err));
        console.log('Connected to the database');

    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}
async function addMember(memberData) {
    try {
        await connectToDatabase();
        const newMember = new Member(memberData);
        await newMember.save();
        console.log('Member added successfully:', newMember);
        return newMember;
    } catch (error) {
        console.error('Error adding member:', error);
        throw error;
    }
}
// Function to get members from the database
async function getMembers() {
    try {
        // Ensure the database connection is established
        await connectToDatabase();

        // Find all members and select only MemberId and MemberName fields
        const members = await Member.find({}, { firstName: 1, lastName: 1 ,identityCard: 1});

        if (!members || members.length === 0) {
            console.log('No members found');
            return [];
        }

        console.log('Members found:', members);
        return members; // Convert Mongoose documents to plain JavaScript objects
    } catch (error) {
        console.error('Error fetching members:', error);
        throw error;
    }
}

async function getMember(memberId) {
    try {
        await connectToDatabase();
        // Find the member by ID
        const member = await Member.findById(memberId);
        return member;
    } catch (error) {
        console.error('Error fetching member:', error);
        throw error;
    }
}

async function updateMember(memberId, memberData) {
    try {
        // Ensure that memberData only contains fields that you intend to update
        const updateFields = {
            lastName: memberData.last_name,
            firstName: memberData.first_name,
            city: memberData.city,
            street: memberData.street,
            streetNumber: memberData.street_number,
            dateOfBirth: memberData.birth_date,
            telephone: memberData.telephone,
            mobilePhone: memberData.mobile
        };


        // Find the member by ID and update the specified fields
        const updatedMember = await Member.findByIdAndUpdate(memberId ,updateFields, { new: true});
        return updatedMember;
    } catch (error) {
        console.error('Error updating member:', error);
        throw error;
    }
}

async function deleteMember(memberId) {
    try {
        // Find the member by ID and delete it
        const deletedMember = await Member.findByIdAndDelete(memberId);
        return deletedMember;
    } catch (error) {
        console.error('Error deleting member:', error);
        throw error;
    }

}

async function getCovidInfo(memberId) {
    try {
        // Find vaccine doses for the specified member ID
        const doses = await Vaccine.find({ MemberId: memberId }).select('numberInjection injectionDate manufacturer');

        // Find COVID information for the specified member ID
        const covid = await Covid.findOne({ MemberId: memberId }).select('contaminationDate recoveryDate');

        return { doses, covid };
    } catch (error) {
        console.error('Error getting COVID information:', error);
        throw error;
    }
}



async function addContamination(id, contamination) {
    try {
        await connectToDatabase();
        // Insert contamination date into MongoDB
        await c(id, contamination);
    } catch (error) {
        throw new Error(`Error adding contamination: ${error.message}`);
    }
}
async function addVaccine(doseInfo) {
    try {
        const newVaccineDose = new Vaccine(doseInfo);
        await newVaccineDose.save();
        console.log('Vaccine added successfully');
        return true;
    } catch (error) {
        console.error('Error adding vaccine:', error);
        return false;
    }
}
async function getVaccine(memberId) {
    async function getMember(memberId) {
        try {
            await connectToDatabase();
            // Find the member by ID
            const member = await Member.findById(memberId);
            return member;
        } catch (error) {
            console.error('Error fetching member:', error);
            throw error;
        }
    }
}

async function addContamination(id, contamination){
    try {
        const newContamination = new Covid(contamination);
        await newContamination.save();
        console.log('Date added successfully');
        return true;
    } catch (error) {
        console.error('Error adding vaccine:', error);
        return false;
    }

}


module.exports = {
    connectToDatabase,
    Member,
    Dose: Vaccine,
    addMember,
    getMembers,
    getMember,
    updateMember,
    deleteMember,
    getCovidInfo,
    getVaccine,
    addVaccine,
    addContamination
};