const mongoose = require('mongoose')

const AgentSchema =  mongoose.Schema({
    agantName: { type : String}
})

const UserSchema =  mongoose.Schema({
    firstName: { type: String, default: ""},
    dob: { type: Date},
    address: { type: String, default: ""},
    phone: { type: String, default: ""},
    state: { type: String,default: ""},
    zipCode: { type: String, default: ""},
    email: { type: String, default: ""},
    gender: { type: String, default: ""},
    userType: { type: String, default: ""},
})

const AccountSchema =  mongoose.Schema({
    accountName: { type : String}
})

const LOBSchema =  mongoose.Schema({
    category_name: { type : String}
})

const CarrierSchema =  mongoose.Schema({
    company_name: { type : String}
})

const PolicySchema =  mongoose.Schema({
    policyNumber: { type: String},
    startDate: { type: Date},
    endDate: { type: Date},
    collectionId: { type: mongoose.Schema.Types.ObjectId},
    companyId: { type: mongoose.Schema.Types.ObjectId,},
    userId: { type: mongoose.Schema.Types.ObjectId},
})

const MessageSchema =  mongoose.Schema({
    message: { type : String},
    date: { type : Date}
})


const Agent = mongoose.model('Agent', AgentSchema);
const User = mongoose.model('User', UserSchema);
const UserAccount = mongoose.model('UserAccount', AccountSchema);
const LOB = mongoose.model('LOB', LOBSchema);
const Carrier = mongoose.model('Carrier', CarrierSchema);
const Policy = mongoose.model('Policy', PolicySchema);
const Message = mongoose.model('Message',MessageSchema)

module.exports = { Agent, User, UserAccount, LOB, Carrier, Policy, Message };