import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';

interface User {
  id?: number;
}

const LocalStrategy = passportLocal.Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
  },
  (account, password, done) => {
    User.findOne({ account }).then(user => {
      if (!user) {
        return done(null, false, { message: 'This account is not registered' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        return isMatch
          ? done(null, user)
          : done(null, false, { message: 'account or password incorrect' });
      });
    });
  }
));

passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
  User.findById(jwt_payload.id, (err: Error, user: User) => {
    if (err) return done(null, false, { message: 'account or password incorrect' });
    return user
      ? done(null, user)
      : done(null, false, { message: 'This account is not registered' });
  });
}));

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: Error, user: User) => {
    done(err, user);
  });
});

export default passport;
