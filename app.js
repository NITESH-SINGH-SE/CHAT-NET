const express = require("express");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Connecting database
var data;
const mongoose = require("mongoose");
const server = app.listen(PORT,async ()=>{
    console.log(`Server on port ${PORT}`);
    mongoose.connect("mongodb://0.0.0.0/chat-net");
    data=await Register.find()
    // console.log(Register.query(findOne({email: 'user1@gmail.com'})));
    // console.log(data);
})

// Register
const Register = require("./register");

// Using json
app.use(express.json());    // To use json files format
app.use(express.urlencoded({extended:false}));  // For using the url and getting the data.

// Using static files
app.use(express.static(path.join(__dirname, 'public')));

// Socket Programming
const io = require('socket.io')(server);
io.on('connection', onConnected);

let socketsConnected = new Set();

function onConnected(socket){
    console.log(socket.id);
    socketsConnected.add(socket.id);

    io.emit('clients-total', socketsConnected.size)

    socket.on('disconnect', ()=>{
        console.log('Socket disconnected', socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    })

    socket.on('message', (data) =>{
        console.log(data);
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) =>{
        socket.broadcast.emit('feedback', data)
    })
}

// EndPoints

// Home Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/landing.html");
})

// Register Page
app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/public/register.html");
});

app.post("/register", async (req, res)=>{
    try{
        const password = req.body.pass;
        const confirmpassword = req.body.passCon;

        if(password === confirmpassword){
            const registerEmployee = new Register({
                name: req.body.name,
                email: req.body.email,
                password: req.body.pass,
                score: 0,
                delete: false
            })

            const token = await registerEmployee.generateAuthToken();
            
            const registered = await registerEmployee.save();
            // res.status(201).sendFile(__dirname + "/public/index.html");
            res.redirect("/chat");
        }
        else{
            // res.send("Password Not Matching");
            alert("Passwords are not matching!")
        }
    }catch(error){
        res.status(400).send(error);
    }
});

// Login Pages
app.get("/login", function (req, res){
    res.sendFile(__dirname + "/public/login.html");
});

app.post("/login", async (req, res)=>{
    try{
        const email1 = req.body.email;
        const password1 = req.body.pass;
        
        const user = await Register.findOne({email: email1});
        
        if(user.password == password1){;
            // res.status(201).sendFile(__dirname + "/public/index.html");
            res.redirect("/chat");
        }
        else{
            res.send("Invalid Details");
        }
    } catch(error){
        res.status(400).send("Invalid Details");
    }
});

// Welcome Pages
app.get("/welcome", function (req, res){
    res.sendFile(__dirname + "/public/welcome.html");
});

// Home Page
app.get("/home", function (req, res){
    res.sendFile(__dirname+"/public/home.html");
})

// Play Games
app.get("/chat", (req, res) => {
    res.sendFile(__dirname + "/public/chat.html");
});

const f = async ()=>{
    data=await Register.find()
    console.log(data);
}
