// controllers/admincontroller.js
const Home = require('../models/homes');

// helper to check login
function getLoginStatus(req) {
  return req.session && req.session.user ? true : false;
}

// ✅ Render add home page
exports.getaddhome = (req, res) => {
  console.log("second middleware", req.url, req.method);
  res.render('admin/edit-home', {
    tittle: "Add Home",
    currentpage: 'add-home',
    editing: false,
    isloggedin: getLoginStatus(req),
  });
};

// ✅ Render edit home page
exports.getedithome = (req, res) => {
  const homeid = req.params.homeid || req.query.homeid;
  const editing = req.params.editing === 'true' || req.query.editing === 'true';
  console.log("Searching home with ID:", homeid, "typeof:", typeof homeid);

  Home.findById(homeid).then(home => {
    if (!home) {
      console.log("Home not found for ID:", homeid);
      return res.redirect("/host/host-home-list");
    }

    console.log("in the edit page", homeid, editing, home);
    res.render('admin/edit-home', {
      tittle: "Edit Home",
      home,
      currentpage: 'edit-home',
      editing,
      isloggedin: getLoginStatus(req),
    });
  });
};

// ✅ Handle edit home submit
exports.postedithome = (req, res) => {
  console.log("in the edit submit page", req.url, req.method, req.body);

  const { homeid, name, address, price, photourl, rating, description } = req.body;
  const home = new Home(name, address, price, photourl, rating, description);
  home._id = homeid;

  home.save()
    .then(result => {
      console.log("Home updated", result);
      res.redirect('/host/host-home-list');
    })
    .catch(err => {
      console.error("Error updating home:", err);
      res.status(500).send("Error updating home");
    });
};

// ✅ Handle new home submission
exports.homeadded = (req, res) => {
  console.log("in the submit page", req.url, req.method, req.body);

  const { name, address, price, photourl, rating, description, _id } = req.body;
  const home = new Home(name, address, price, photourl, rating, description, _id);

  home.save()
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch(err => {
      console.error("Error adding home:", err);
      res.status(500).send("Error adding home");
    });
};

// ✅ Get all homes for host
exports.gethome = (req, res) => {
  console.log("first middleware", req.url, req.method);

  Home.fetchAll()
    .then((registeredhome) => {
      res.render('admin/host-home-list', {
        registeredhome,
        tittle: "Host Homes list",
        isloggedin: getLoginStatus(req),
      });
    })
    .catch(err => {
      console.error("Error fetching homes:", err);
      res.status(500).send("Database error");
    });
};

// ✅ Delete home
exports.postdeletehome = (req, res) => {
  const homeid = req.params.homeid;
  console.log("in the delete home", homeid);

  Home.deleteById(homeid)
    .then(() => {
      console.log("Home deleted successfully");
      res.redirect("/host/host-home-list");
    })
    .catch(err => {
      console.error("Error deleting home:", err);
      res.status(500).send("Error deleting home");
    });
};
