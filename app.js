// SETUP --------------------------------------
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");
    http = require('http');
    server = http.createServer(app);
    
    
// APP CONFIGURATION --------------------------------------

// mongoose.connect("mongodb://localhost/todolist");
mongoose.connect("mongodb://public:public123@ds121099.mlab.com:21099/todolist");

/*console.log(process.env.DATABASEURL);*/
/*mongoose.connect(process.env.DATABASEURL);*/

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION --------------------------------------
//opens user session (keeps user logged in)
// app.use(require("express-session")({
//     secret: "shhhhhh",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//MONGOOSE MODEL CONFIGURATION ---------------------------------------------------------

var itemSchema = new mongoose.Schema({
    text: String,
    cross: Boolean
});

var Item = mongoose.model("Item", itemSchema);


//ROUTES  -------------------------------------------------------------------------------------
app.get("/", function(req, res){
    res.render("landing");
});

 //getting all items from database
app.get("/items", function(req, res){
    Item.find({}, function(err, items){
        console.log("works");
        if (err){
            res.send(err);
        }
        else {
            //returns all items in JSON format
            /*console.log(items);*/
            res.render("index", {items: items});
        }
    });
});
//creating an item and sending the item info back
app.post("/items", function(req, res){
    var task = {text: req.body.item, cross: false};
    console.log("post request");
    Item.create(task, function(err, newtask){
        if (err){
            res.send(err);
        }
        else {
            console.log('i made a task', newtask);
            res.contentType('json');
            res.send({created: newtask, task: task});
        }
    });
});
app.post("/items/:id", function(req, res){
    if (!req.body || !req.body.id){
        return res.status(400).send({error: "cannot find body or id"});
    }
    console.log(req.body.cross);
    Item.findByIdAndUpdate(req.body.id, {cross: req.body.cross}, function(err){
        if (err){
            res.send(err);
        }
        else {
            console.info('UPDATED');
            res.send({});
        }
    });
});    

//deleting an item 
app.delete("/items/:id", function(req, res){
    console.info('delete req:', req.body);
    if (!req.body || !req.body.id){
        return res.status(400).send({error: "cannot find body or id"});
    }
    Item.findByIdAndRemove(req.body.id, function(err){
        if (err){
            console.warn('delete problem');
            res.redirect("/items");
        }
        else {
            console.info('delete great success');
            res.send({});
            
        }
    });
});
// ROUTES (for authentication) --------------------------------------

/*//showing register form
app.get("/register", function(req, res) {
    res.render("register");
});
//receiving 
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
    });
});
//showing login form
app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/items", 
        failureRedirect: "/login"
    }), function(req, res) {
});

//logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/")
});

function isLoggedIn(req, res, next){
    console.log("logged in?");
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}*/

// LISTEN (start app with node app.js) --------------------------------------
/*for Cloud9 IDE*/
/*app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server running");
});*/

server.listen(3000, 'localhost');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});