const User = require('../models/user.js');


module.exports.getSignUp= (req,res)=>{
  res.render("signup.ejs");
}

module.exports.addUser=async(req,res,next)=>{
  try{
    let{username,password,email}=req.body;
    const newUser = new User({email,username});
    const user  = await User.register(newUser,password);
    req.login(user,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","User Create Successfully");
    res.redirect('/listing');
    })
    
  }catch(e){
    req.flash("error",e.message);
    res.redirect('/signup')
    }
}

module.exports.getLogin=(req,res)=>{
  res.render('login.ejs')
}

module.exports.login=async (req, res) => {
  req.flash("success","Welcome to Ouber");
  const redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect( redirectUrl);
}

module.exports.logoutFun = (req,res,next)=>{
  req.logOut((err)=>{
  if(err){
   return next(err);
  }
  req.flash("success","You can Logout")
  res.redirect('/listing');
  })
}