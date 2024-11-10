
if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}
const express = require ("express");
const mongoose = require('mongoose');
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const ExpressError = require ('./utils/ExpressError.js')
const sampleListings = require('./models/data.js')
const listingRouter = require ("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const Listing = require("./models/inites.js");
const Review = require("./models/review.js");
const initData = require("./models/data.js");

const AtlusDBUrl = process.env.MONGODB_URL

const app = express();


app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs')
app.use(express.urlencoded({extends:true}))
app.use(methodOverride('_method')); 
app.engine('ejs',ejsMate) 
app.use(express.static(path.join(__dirname,"/public")))
 

const store= MongoStore.create({
  mongoUrl:AtlusDBUrl,
  crypto:{
   secret:process.env.SESSION_SECRET,
  },
  touchAfter:24 * 3600,
});

store.on("error", ()=>{
  console.log("ERROR IN MONGO SESSIONS");
})

const sessionOption = {
  store: store,
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 *24*60*60*1000,
    maxAge:7 *24*60*60*1000,
    httpOnly:true
  }
};


main().then(()=>{
  console.log("Done connected db")
}).catch((e)=>{console.log(e)})

async function main() {
  await mongoose.connect(AtlusDBUrl);
}
app.get("/", async(req,res)=>{
  // res.render("home.ejs")
  res.redirect("/listing");
})


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
})

app.get('/demo',async(req,res)=>{
  let fakeUSer = new User({
    email:"aryan@gmail.com",
    username:"Aryan"
  })

const newUser = await User.register(fakeUSer,"hellword");
res.send(newUser);

})


app.use("/listing", listingRouter);
app.use("/list/:id/review",reviewsRouter)
app.use("/",userRouter)

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not Found"))
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong!!"}=err;
  res.status(statusCode).render('Error.ejs',{message});
})


// const initDb = async ()=>{
// await Listing.deleteMany({});
// await Listing.insertMany(sampleListings);

// }
// initDb();

app.listen(8080,()=>{
  console.log("server will be running on port 8080")
})