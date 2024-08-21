const express = require('express');
const cors = require('cors');
const os = require("os")
const app = express();
const mongoose = require('mongoose');
const { exec  } = require('child_process');

app.use(
    cors({
        credentials: true, // This is important.
        origin: true,
    })
);

// configure the app to use bodyParser()
app.use(express.urlencoded({
    extended: true
}));

//connect mongo db
const options ={
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    serverSelectionTimeoutMS: 300000
}


const connectWithRetry = () => {
//     // mongoose.connect('mongodb+srv://test:testAdmin@cluster0.gkdei.mongodb.net/backend-task', options).then(() => {
    mongoose.connect("mongodb://localhost:27017/backend-task", options).then(() => {
        console.log("Database connected")
    }).catch(err => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.', err)
      setTimeout(connectWithRetry, 3000)
    })
    
  };

connectWithRetry();


setInterval(() => {
    let cpuUsage = os.loadavg()[0];
    if(cpuUsage > 0.7){
        process.exit(1)
    }
}, 5000)


app.use(express.json());

app.use((req, res, next) => {
    // res.setHeader('Content-Type', 'text/event-stream');
    res.header('Content-Type', 'application/json')
    res.header('Cache-Control', 'no-cache');
    res.header('Connection', 'keep-alive');
    next()
})

app.use("/api", require("./routes/common.routes"));

app.get("/", (req, res) => {
    res.status(200).send({ message: "Task Implementation" });
});

app.listen(8080, () => {
    console.log(`Server is listening on port 8080`);
});

