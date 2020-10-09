const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const MaskData = require('maskdata');

let validPassword = new passwordValidator();
validPassword
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces();                           // Should not have spaces

exports.signup = (req, res, next) => {
  if (
    !emailValidator.validate(req.body.email) ||
    !validPassword.validate(req.body.password)
  ) {
    return res.status(403).json({
      message:
        "le mot de passe doit contenir une majuscule, une minuscule et un chiffre. Sa longueur doit être comprise entre 8 et 20 caractères",
    });
  } else if (
    emailValidator.validate(req.body.email) &&
    validPassword.validate(req.body.password)
  ) {
    const maskedMail = MaskData.maskEmail2(req.body.email);
    console.log(maskedMail);
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: maskedMail,
          password: hash,
        });
        user.save((err, user) => {
          if (!err)
            res.status(201).json({ message: "Nouvel utilisateur créé !" });
          else {
            res.status(400).json({ err });
          }
        });
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login =  (req, res, next) => {
  const maskedMail = MaskData.maskEmail2(req.body.email);
    User.findOne({ email: maskedMail })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};