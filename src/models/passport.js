const async = require("hbs/lib/async");
const { TokenExpiredError } = require("jsonwebtoken");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const register = require("./Register");
//const cv = require("./")


passport.use(
    new StrategyJwt({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.TOKEN_KEY,
        },

        async(token, done) => {
            try {
                return done(null, token)
            } catch (err) {
                console.log(err)
            }
        }
        /*
        function(jwtPayload, done) {
            return register.findOne({ where: { id: jwtPayload.id } })
                .then((register) => {
                    return done(null, register);
                })
                .catch((err) => {
                    return done(err);
                });
        }*/
    )
);