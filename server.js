const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require("./app/config/db.config");
const bodyParser = require('body-parser');


const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origins: ['http://192.168.1.178:8081']
  }
});

global.__basedir = __dirname;

var corsOptions = {
  origin: [
    "http://192.168.1.178:8081", 
    "http://192.168.1.178:8082", 
    "http://localhost:8081", 
    "http://localhost:8082", 
    "https://maps.googleapis.com/maps/api/",
    "https://benevolent-jalebi-b22329.netlify.app",
    "https://dormate.netlify.app",
    "https://dormate-app.onrender.com/",
    "https://dormate-backend.onrender.com",
    "https://dormate-admin.netlify.app/"
  ],
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  credentials: true,
  origin: true,
};

app.use(cors(corsOptions));

// const initRoutes = require("./app/routes");
// initRoutes(app); 

// parse requests of content-type - application/json
app.use(express.json());

// Make "public" Folder Publicly Available
app.use("/public", express.static("public"));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


app.use(
  cookieSession({
    name: "dormate-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('my message', (msg) => {
    io.emit('my broadcast', `server: ${msg}`);
  });
});


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to e-Tech application." });
});

//routes
require("./app/routes/dorm.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/admin.routes')(app);
require('./app/routes/schedule.routes')(app);
require('./app/routes/payment.routes')(app);
require('./app/routes/index')(app);



// set port, listen for requests
const PORT = process.env.PORT || 8080;
// const HOSTNAME = "192.168.1.178";
http.listen( PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


const db = require("./app/models");
const Role = db.role;
//mongodb+srv://angelonatad22:j2xroMaxp8cSfQEr@dormate.u7iebjw.mongodb.net/ 
//mongodb://${dbConfig.HOST}:${dbConfig.PORT}
db.mongoose
  .connect(`mongodb+srv://angelonatad22:${dbConfig.PASS}@dormate.u7iebjw.mongodb.net/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
    initial();
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

  function initial() {
    Role.estimatedDocumentCount( async (err, count) => {
      try{
        if (!err && count === 0) {
          new Role({
            name: "user"
          }).save(err => {
            if (err) {
              console.log("error", err);
            }
    
            console.log("added 'user' to roles collection");
          });
    
          new Role({
            name: "landlord"
          }).save(err => {
            if (err) {
              console.log("error", err);
            }
    
            console.log("added 'landlord' to roles collection");
          });
    
          new Role({
            name: "admin"
          }).save(err => {
            if (err) {
              console.log("error", err);
            }
    
            console.log("added 'admin' to roles collection");
          });
        }
      } catch (err) {
        console.log(err);
      }

    });
  }

  // Import visit model
  const Visit = require('./app/models/visit.model');  // Ensure this path is correct
// Helper to get client IP
const getClientIp = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
  return ip.replace(/^.*:/, ''); // Strip IPv6 prefix for simplicity
};

// Routes
app.get('/api/visits', async (req, res) => {
  try {
      let visit = await Visit.findOne({});
      if (!visit) {
          visit = new Visit({ count: 0, ips: [] });
          await visit.save();
      }
      res.json(visit);
  } catch (err) {
      console.error('Error fetching visits:', err);
      res.status(500).send(err);
  }
});

app.post('/api/visits/increment', async (req, res) => {
  try {
      let visit = await Visit.findOne({});
      if (!visit) {
          visit = new Visit({ count: 0, ips: [] });
      }
      visit.count++;
      const clientIp = getClientIp(req);
      console.log('Client IP:', clientIp);
      if (!visit.ips.includes(clientIp)) {
          visit.ips.push(clientIp);
      }
      await visit.save();
      res.json(visit);
  } catch (err) {
      console.error('Error incrementing visits:', err);
      res.status(500).send(err);
  }
});

  

