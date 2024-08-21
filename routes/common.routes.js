const express = require("express");
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const schedule = require('node-schedule')
const { Worker } = require('worker_threads');
const { User, Policy, Message } = require('../Model/common.model');   


const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
    try {
        const filePath = req.file.path;
        const worker = new Worker("././controller/worker", {
            workerData: { filePath },
        });

        worker.on('message', (result) => {
            return res.status(200).send(result)
        })

        worker.on('error', (error) => {
            return res.status(500).send(error)
        })
        
    } catch (error) {
        return res.status(500).json({ success: fales, msg: error});
    }
})

router.get('/policy/:username', async (req, res) => {
    try {
        const user = await User.findOne({ firstName : req.params.username});
        if(!user){
            return res.status(400).send('User Not found')  
        }
        const policies = await Policy.find({ userId : user._id})
        return res.status(200).send(policies)
    } catch (error) {
        return res.status(500).send(error.message)
    }
})

router.get('/policies/aggregate', async (req, res) => {
    try {
        const aggregation = await Policy.aggregate([
            {
                $group: {
                    _id: "userId",
                    policies: {
                        $push: "$$ROOT"
                    },
                    count: { $sum: 1 },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: 'userDetails'
                }
            }
        ])
        return res.status(200).json(aggregation)
    } catch (error) {
        return res.status(500).send(error.message)
    }
});

router.post('/schedule-message', (req, res) => {
    try {
        const { message, day, time } = req.body;
        const date = new Date(`${day} ${time}`)
        const job = schedule.scheduleJob(date, async() => {
            const newMessage = new Message({
                message: message,
                date : date
            })
            await newMessage.save();
        })
        return res.status(200).send("Message Scheduled Successfully")
    } catch (error) {
        return res.status(500).send(error.message)
    }
})


module.exports = router;