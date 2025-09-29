// controllers/homescontroller.js
const Favorite = require('../models/favorite');
const Home = require('../models/homes');
const { error } = require('./404');

// helper
function getLoginStatus(req) {
  return req.session && req.session.user ? true : false;
}

// ✅ Get all homes
exports.gethome = (req, res) => {
  console.log("first middleware", req.url, req.method);

  Home.fetchAll()
    .then((registeredhome) => {
      res.render('store/home-list', {
        registeredhome,
        tittle: "Airbnb Homes",
        isloggedin: getLoginStatus(req),
      });
    })
    .catch(err => {
      console.error("Error fetching homes:", err);
      res.status(500).send("Database error");
    });
};

// ✅ Get single home details
exports.gethomedetails = (req, res) => {
  const homeid = req.params.homeid;
  console.log("in the details page", homeid);

  Home.findById(homeid)
    .then(home => {
      if (!home) {
        console.log("Home not found");
        return res.redirect('/');
      }

      res.render('store/home-details', {
        home,
        tittle: home.name,
        favorite: req.query.favorite || false,
        isloggedin: getLoginStatus(req),
      });
    })
    .catch(err => {
      console.error("Error fetching home details:", err);
      res.status(500).send("Database error");
    });
};

// ✅ Get front home list
exports.gethomelist = (req, res) => {
  console.log("first middleware", req.url, req.method);

  Home.fetchAll()
    .then((registeredhome) => {
      res.render('store/front-list', {
        registeredhome,
        tittle: "home list",
        isloggedin: getLoginStatus(req),
      });
    })
    .catch(err => {
      console.error("Error fetching home list:", err);
      res.status(500).send("Database error");
    });
};

// ✅ Get bookings
exports.getbooking = (req, res) => {
  console.log("first middleware", req.url, req.method);

  Home.fetchAll()
    .then((registeredhome) => {
      res.render('store/bookings', {
        registeredhome,
        tittle: "My Bookings",
        isloggedin: getLoginStatus(req),
      });
    })
    .catch(err => {
      console.error("Error fetching bookings:", err);
      res.status(500).send("Database error");
    });
};

// ✅ Get favorite homes
exports.getfavorite = (req, res) => {
  Favorite.getfavorites()
    .then(favorites => {
      const favIds = favorites.map(fav => fav.houseid.toString());
      console.log("Favorite IDs:", favIds);

      return Home.fetchAll().then(registeredhome => {
        const favoriteHomes = registeredhome.filter(home =>
          favIds.includes(home._id.toString())
        );

        console.log("Matched Favorite Homes:", favoriteHomes);

        res.render('store/favorite-list', {
          favoriteHomes,
          tittle: "My Favorites",
          currentpage: "favorite",
          isloggedin: getLoginStatus(req),
        });
      });
    })
    .catch(err => {
      console.error("Error fetching favorites:", err);
      res.status(500).send("Error fetching favorites");
    });
};

// ✅ Add to favorite
exports.addtofavorite = (req, res) => {
  console.log("in the add to favorite", req.url, req.method, req.body);

  const homeId = req.body.homeid;

  if (!homeId) {
    console.error("No home ID provided");
    return res.status(400).send("Home ID is required");
  }

  console.log("Adding to Favorites Home ID:", homeId);
  const fav = new Favorite(homeId);

  fav.save()
    .then(result => {
      console.log("Added to Favorites:", result);
      res.redirect("/favorites");
    })
    .catch(err => {
      console.error("Error adding to favorites:", err);
      res.status(500).send("Error adding to favorites");
    });
};

// ✅ Delete home from favorites
exports.deletehomefromfavorites = (req, res) => {
  const homeid = req.params.homeid;
  console.log("in the delete home", homeid);

  Favorite.deleteById(homeid)
    .then(result => {
      console.log("Home deleted successfully from favorites", result);
      res.redirect("/favorites");
    })
    .catch(err => {
      console.error("Error deleting home from favorites:", err);
      res.status(500).send("Error deleting home from favorites");
    });
};
