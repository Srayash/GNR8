const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const z = require("zod");
const cors = require("cors");
const passport = require("passport");
const dotenv = require("dotenv").config();
const User = require("./models/userModel");
require("dotenv").config();

const app = express();
const BASE_BE_URL = process.env.BE_URL || "http://localhost:3000";
const BASE_FE_URL = process.env.FE_URL || "http://localhost:5173";
const dbURI = process.env.DB_URL;
mongoose
  .connect(dbURI)
  .then(console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

const corsOptions = {
  origin: BASE_FE_URL,
  credentials: true,
  exposedHeaders: ["Authorization"],
};


app.use(cors(corsOptions));
app.use(express.json());

const mainRouter = require("./routes/index");

// Session middleware
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true, httpOnly: true, sameSite:"none", maxAge: 24 * 60 * 60 * 1000 },
    })
  );
  
  // Passport.js initialization
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(express.json());
  
  passport.serializeUser((user, done) => {
    //   console.log("Serializing user with ID:", user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      // console.log("Deserializing user with ID:", id);
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

app.use("/api/v1", mainRouter);

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_BE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user details from the Google profile
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const name = profile.displayName;
        // console.log(email);
        // console.log(googleId);
        // console.log(name);
        const user = await User.findOrCreate(
          { email }, // Match by email (ensures uniqueness)
          {
            email,
            googleId,
            name, // Only Google or Github users will have this field populated
          }
        );

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect(`${BASE_FE_URL}/`);
  }
);

const GitHubStrategy = require("passport-github2").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${BASE_BE_URL}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = null;

        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value; // Use the first email
        } else {
          // Fetch email using GitHub API if not available in profile
          const response = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const emails = await response.json();
          const primaryEmail = emails.find((e) => e.primary && e.verified);
          if (primaryEmail) {
            email = primaryEmail.email;
          }
        }

        if (!email) {
          return done(new Error("Unable to retrieve email from GitHub."));
        }
        const githubId = profile.id;
        const name = profile.username;
        // console.log(githubId);
        // console.log(name);
        // console.log(email);
        const user = await User.findOrCreate(
          { email }, // Match by email (ensures uniqueness)
          {
            email,
            githubId,
            name, // Only Google or Github users will have this field populated
          }
        );
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    // res.setHeader("Authorization", `Bearer ${req.user}`);
    console.log(req.user)
    res.redirect(`${BASE_FE_URL}`);
  }
);

const passportLocal = require("passport-local").Strategy;

passport.use(
  new passportLocal(
    {
      usernameField: "email", // Email is used as the username
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "No user found with that email" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

const signupBody = z.object({
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
});

app.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid inputs" });
    }

    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ email, password });

    req.login(user, (err) => {
        if (err) {
            return res.status(500).json({ message: "Login after signup failed" });
        }

        return res.status(201).json({
            message: "User created and signed in successfully",
            user: {
                id: user._id,
                email: user.email,
            },
        });
    });
});

app.post(
  "/api/v1/user/signin",
  passport.authenticate("local", { session: true }),
  (req, res) => {
    res.json({
      message: "Signed in successfully",
      name: req.user,
    });
  }
);

app.delete('/api/v1/user/signout', (req, res, next) => {
  // Passport’s req.logout now accepts a callback
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Optionally destroy the session
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      // Clear the session cookie if necessary (adjust the cookie name to match your setup)
      res.clearCookie('connect.sid');
      // Send a JSON response confirming logout
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

app.get("/api/v1/user_data", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    res.json({
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
    });
});

app.get("/session-test", (req, res) => {
  console.log("Session data:", req.session);
  res.json({ session: req.session });
});

app.listen(3000);