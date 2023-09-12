var express = require("express");
var router = express.Router();
const User = require("../models/users");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/checkBody");

router.post("/signup", function (req, res) {
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "champs manquants ou vides" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    // Vérifie si l'utilisateur n'est pas déjà enregistré dans la BDD
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const { username, email } = req.body;

      const newUser = new User({
        username,
        email,
        password: hash,
        token: uid2(32),
        wishList: []
      });
      newUser.save().then((newDoc) => {
        res.json({ result: true, data: newDoc });
      });
    } else {
      // Utilisateur déjà existant dans la BDD
      res.json({ result: false, error: "Utilisateur déjà existant" });
    }
  });
});

router.post("/signin", (req, res) => {
  // Vérifie que les champs ne sont pas vides
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "champs manquants ou vides" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    // Vérifie si l'utilisateur est bien présent dans la BDD
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, data: data });
    } else {
      res.json({
        result: false,
        error: "Utilisateur non trouvé ou mauvais mot de passe",
      });
    }
  });
});

// router.put('/:token', (req, res) => {

//   User.updateOne({token:req.params.token}, {$push : {...req.body}}).then(() => {
//     User.findOne({token:req.params.token}).then(userUpdated => {
//     if (userUpdated) {
//       console.log('data : ', userUpdated)
//     res.json({userUpdated: userUpdated })
//     } else {
//       res.json({erreur : "Utilisateur non trouvé" })
//     }
//   })
//   })
// })

//ajouter un pokemon en wishList

router.put("/:token", (req, res) => {
  const { pokemonId } = req.body;

  User.findOne({ token: req.params.token }).then((user) => {
    if (user) {
      // Vérifie si le Pokémon est déjà dans la wishlist
      if (user.wishList.includes(pokemonId)) {
        res.json({
          result: false,
          message: "Le Pokémon est déjà dans la wishlist.",
        });
      } else {
        // Ajoute le Pokémon à la wishlist s'il n'est pas déjà présent
        user.wishList.push(pokemonId);
        user.save().then(() => {
          res.json({
            result: true,
            message: "Pokémon ajouté à la wishlist avec succès.",
          });
        });
      }
    } else {
      res.json({ erreur: "Utilisateur non trouvé" });
    }
  });
});

// récupérer la wishList d'un utilisateur

router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token })
  .populate("wishList")
  .then((user) => {
    console.log(user)
    if (user.wishList.length > 0) {
      res.json({ result: true, pokemons : user.wishList });
    } else {
      res.json({ result: false, error: "user does not have a wishList" });
    }
  });
});
module.exports = router;
