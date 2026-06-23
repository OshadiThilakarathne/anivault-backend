import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) return done(null, user);

        // Check if email already registered manually
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google to existing account
          user.googleId = profile.id;
          user.avatar   = profile.photos[0]?.value;
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName.replace(/\s+/g, "_").toLowerCase(),
          email:    profile.emails[0].value,
          avatar:   profile.photos[0]?.value,
          password: Math.random().toString(36).slice(-16), // random password
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;