import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import passportGithub from 'passport-github';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';

const LocalStrategy = passportLocal.Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;
const GithubStrategy = passportGithub.Strategy;
const { JWT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CLIENT_CALLBACK } = process.env;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
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
  User.findById(jwt_payload.id, (err: Error, user: Express.User) => {
    if (err) return done(null, false, { message: 'account or password incorrect' });
    return user
      ? done(null, user)
      : done(null, false, { message: 'This account is not registered' });
  });
}));

passport.use(new GithubStrategy(
  {
    clientID: GITHUB_CLIENT_ID!,
    clientSecret: GITHUB_CLIENT_SECRET!,
    callbackURL: GITHUB_CLIENT_CALLBACK,
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile)
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: Error, user: Express.User) => {
    done(err, user);
  });
});

export default passport;
