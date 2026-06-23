import "../env.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const callbackURL = process.env.NODE_ENV === "production"
  ? "https://anivault-backend.onrender.com/api/auth/google/callback"
  : "http://localhost:5000/api/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
      proxy:        true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          user.avatar   = profile.photos[0]?.value;
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          googleId:  profile.id,
          username:  profile.displayName.replace(/\s+/g, "_").toLowerCase(),
          email:     profile.emails[0].value,
          avatar:    profile.photos[0]?.value,
          password:  Math.random().toString(36).slice(-16),
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;