const Home = require('../models/homes');
const { check, validationResult } = require("express-validator");

exports.getlogin = (req, res, next) => {
  console.log("login page");
  res.render("auth/loginpage", {
    tittle: "Login",
    currentpage: "login",
    editing: false,
    isloggedin: req.session.user ? true : false,
    
  });
};

exports.postlogin = (req, res, next) => {
 
  console.log("login post", req.body);
  
  res.cookie("isloggedin",true);
  // 🔹 Normally you would check email & password from DB
  // For now, let’s assume user always logs in
  const user = { email: req.body.email }; 

  // ✅ Save user into session
  req.session.user = user;
  req.session.save(err => {
    if (err) console.error("Session save error:", err);
    res.redirect("/");
  });
};
exports.postlogout = (req, res, next) => {
  console.log("logout post");
  res.cookie("isloggedin",false); 
  req.session.user = null;   // remove user info
  req.session.isLoggedIn = false;
  req.session.destroy(err => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/login");
  });
}
exports.getsignup=(req,res,next)=>{
  console.log("sign up page");  
  res.render("auth/signup",{
    tittle:"Sign Up",
    currentpage:"signup",
    editing:false,
    isloggedin:req.session.user ? true : false
  })
}


exports.postsignup = [
  check("firstname")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First name must contain only letters"),

  check("lastname")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Last name must contain only letters"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain a special character")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must have at least one lowercase letter")
    .trim(),

  check("confirmpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  check("usertype")
    .notEmpty()
    .withMessage("Please select the user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("You must accept the terms and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    console.log("Validation middleware");
    const { firstname, lastname, email, password, usertype } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/signup", {
        tittle: "Sign Up",
        currentpage: "signup",
        editing: false,
        isloggedin: req.session.user ? true : false,
        errorMessages: errors.array().map((err) => err.msg),
        oldInput: { firstname, lastname, email, password, usertype },
      });
    }

    console.log("sign up post");
    console.log(req.body);

    res.redirect("/login");
  },
];



