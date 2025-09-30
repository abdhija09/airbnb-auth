const Home = require('../models/homes');
const { check, validationResult } = require("express-validator");
const { getdb } = require("../utils/databaseutils");
const UserModel = require("../models/user");
const client = require("../utils/databaseutils");
const bcrypt = require("bcrypt");

exports.getlogin = (req, res, next) => {
  console.log("login page");
  res.render("auth/loginpage", {
    tittle: "Login",
    currentpage: "login",
    editing: false,
    isloggedin: req.session.user ? true : false,
    errorMessages:[],
    usertype: null,
    oldInput: { email: ""
  }}
);
};

exports.postlogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const db = getdb();
    const usersCollection = db.collection("users");

    // 1️⃣ Find user by email
    const user = await usersCollection.findOne({ email: email });

    if (!user) {
      return res.status(401).render("auth/loginpage", {
        tittle: "Login",
        currentpage: "login",
        errorMessages: ["Invalid email or password"],
        usertype: user ? user.usertype : null,
        oldInput: { email },
      });
    }

    // 2️⃣ Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render("auth/loginpage", {
        tittle: "Login",
        currentpage: "login",
        errorMessages: ["Invalid email or password"],
        usertype: user ? user.usertype : null,
        oldInput: { email },
      });
    }

    // 3️⃣ Save user info in session
    req.session.user = {
      id: user._id,
      firstname: user.firstname,
      email: user.email,
      usertype: user.usertype,
    };
    req.session.isLoggedIn = true;

    req.session.save((err) => {
      if (err) console.error("Session save error:", err);
      res.cookie("isloggedin", true); // optional
      res.redirect("/");
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).render("auth/loginpage", {
      tittle: "Login",
      currentpage: "login",
      errorMessages: ["Server error. Please try again later."],
      usertype: user ? user.usertype : null,
      oldInput: { email: req.body.email },
    });
  }
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
    isloggedin:req.session.user ? true : false,
    errorMessages: [],
    oldInput: { firstname: "", lastname: "", email: "", password: "", usertype: ""
  }
});
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

  async (req, res, next) => {
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

    try {
      const db = getdb();   
      const User = new UserModel(db);

      await User.createUser({ firstname, lastname, email, password, usertype });

      console.log("User registered successfully");
      res.redirect("/login");

    } catch (err) {
      console.error("Signup error:", err.message);
      return res.status(422).render("auth/signup", { 
        tittle: "Sign Up",
        currentpage: "signup",
        editing: false, 
        isloggedin: req.session.user ? true : false, 
        errorMessages: [err.message], 
        oldInput: { firstname, lastname, email, usertype }, 
      });
    }
  },
];
