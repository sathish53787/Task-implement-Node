const { isMainThread, parentPort, workerData } = require('worker_threads');
const fs = require('fs')
const csv = require("csv-parser")
const { Agent, User, UserAccount, LOB, Carrier, Policy } = require('../Model/common.model');    


const results = [];

fs.createReadStream(workerData.filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async() => {
        for (let row of results) {
            try {
                // Create a new user instance
                const user = new User({
                    firstName: row.firstname,
                    dob: row.dob,
                    address: row.address,
                    phone: row.phone,
                    state: row.state,
                    zipCode: row.zip,
                    email: row.email,
                    gender: row.gender,
                    userType: row.userType,
                });
                                
                await user.save();

                //add Agent details
                const agnet = new Agent({
                    agantName: row.agent,   
                });
                await agnet.save();

                //add account
                const account = new UserAccount({
                    accountName: row.account_name,
                });
                await account.save();

                //add LOB
                const lob = new Carrier({
                    category_name: row.category_name,
                });
                await lob.save();

                //add Carrier
                const carrier = new Carrier({
                    company_name: row.company_name,
                });
                await carrier.save();

                //add Carrier
                const policy = new Policy({
                    policyNumber: row.policy_number,
                    startDate: row.policy_start_date,
                    endDate: row.policy_end_date,
                    collectionId: lob._id,
                    companyId: carrier._id,
                    userId: user._id,
                });
                await policy.save();

            } catch (error) {
                console.error("Error saving user:", error.message);
            }
            
        }
        parentPort.postMessage('File Proceed Successfully');
    })