const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const instagramRoutes = require("./routes/instagramRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Horse Club API Running");
});

app.use("/api/bookings",bookingRoutes);
app.use("/api/gallery",galleryRoutes);
app.use("/api/instagram",instagramRoutes);
app.use("/api/settings",settingsRoutes);

module.exports = app;