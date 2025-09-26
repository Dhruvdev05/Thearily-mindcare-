const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo');;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);   // one server for Express + Socket.IO
const io = socketio(server);             // attach socket.io

// === MongoDB ===
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/mental_health')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Error:', err));

const User = require('./models/user');

// === Middleware ===
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');


const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 60
})

store.on("error", () => {
    console.log("error in mongo session store")
})


// Session + flash
app.use(session({
    store,
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false
}));


app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass currentUser + flash to all views
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// === Routes ===
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const sessionRoutes = require("./routes/sessionRoutes");
const chatRoutes = require("./routes/chat");   // (new for chat)
const problemRoutes = require('./routes/problemRoutes');

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', sessionRoutes);
app.use('/chat', chatRoutes);
app.use('/', problemRoutes);


// Home route
app.get('/', (req, res) => {
    res.render('pages/home');
});

io.on('connection', (socket) => {
    console.log("🟢 New user connected:", socket.id);

    // join a room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // handle chat messages
    socket.on('chatMessage', (data) => {
        io.to(data.roomId).emit('chatMessage', {
            user: data.user,
            text: data.text,
            time: new Date()
        });
    });

    socket.on('disconnect', () => {
        console.log("🔴 User disconnected:", socket.id);
    });
});

// === Server ===
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
