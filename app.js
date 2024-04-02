const express = require("express");
const app = express();
const user = require("./models/user.js");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require('method-override');
const session = require("express-session");
const cart = require("./models/cart.js")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const sessionOptions = {
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));




app.use((req,res,next)=>{
    res.locals.newUser = req.user;        // here we are storing the current user session //
    next();
});

main()
.then((res)=>{
    console.log(res);
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Heliverse");
}


app.get("/",(req,res)=>{
    res.send("server is working..");
});


/*app.get("/users",async(req,res)=>{
    let allUsers  = await user.find({});
    res.render("pages/index.ejs",{allUsers});  
})*/


//index route
app.get("/users", async (req, res) => {
try {
    let users;
    const searchTerm = req.query.search;

    if (searchTerm) {
        // If a search term 
        users = await user.find({ $or: [{ first_name: searchTerm }, { last_name: searchTerm }] });
    } else {
        // If no search term is provided, fetch all users
        users = await user.find({});
    }

    res.render("pages/index.ejs", {users});
}
    catch (err) {
        console.error("Errors", err);
        res.status(500).send("Internal Server Error");
    }
});


//new route
app.get("/users/new",(req,res)=>{
    try{
        res.render("pages/new.ejs");
    }
    catch(err){
        console.log("the error is")
        console.log(err);
    }
});


//show route
app.get("/users/:id",async(req,res)=>{
    let {id} = req.params;
   // console.log(id);
    const users = await user.findById(id);
    res.render("pages/show.ejs",{users});
})



//add new user
app.post("/users",async(req,res)=>{
    let {first_name, last_name, email, gender}= req.body;
    console.log("data saved");
    console.log(req.body);
    const newUser = new user(req.body.user);
    await newUser.save();
    res.redirect("/users");
})


// edit route
app.get("/users/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const users = await user.findById(id);    // then find out user on id basis//
    res.render("pages/edit.ejs",{users})
});


//update user
app.put("/users/:id",async(req,res)=>{
    let {id} = req.params;
    await user.findByIdAndUpdate(id,{...req.body.user});  // here, we have deconstructed & updated our javascript obj {...} //
    console.log("edited");
    res.redirect(`/users/${id}`);
});

// trying add cart user
app.get("/user/:id/cart",async(req,res)=>{
    let {id}  = req.params;
    const team = [];
    const foundUser = await user.findById(id);
    const userArr = team.push(foundUser.id);
    console.log(userArr);
    res.render("pages/cart.ejs");
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})
