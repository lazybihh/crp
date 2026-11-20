const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const Notice = require("./models/Notice");
const Facility = require("./models/Facility");
const { FacilitiesPage } = Facility; // the Facilities page text model lives in the same file
const HomeContent = require("./models/HomeContent");
const Event = require("./models/Event");
const ContactPage = require("./models/ContactPage");
const { EventsPage } = Event;
const SiteSettings = require("./models/SiteSettings");
const Media = require("./models/Media");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// uploaded images are served from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// every API route starts with /api (the front end uses VITE_API_URL=http://localhost:5000/api)
app.use("/api/home", require("./routes/HomeRoutes"));
app.use("/api/facilities", require("./routes/FacilityRoutes"));
app.use("/api/events", require("./routes/EventRoutes"));
app.use("/api/notices", require("./routes/NoticeRoutes"));
app.use("/api/uploads", require("./routes/uploadsRoutes"));
app.use("/api/settings", require("./routes/SettingsRoutes"));
app.use("/api/media", require("./routes/MediaRoutes"));
app.use("/api/enquiries", require("./routes/EnquiryRoutes"));
app.use("/api/contact-page", require("./routes/ContactPageRoutes"));

app.get("/", (req, res) => res.send("Chhotu Ram Polytechnic API is running!"));

// connect, then add the starting rows (notices, facilities, Facilities page text, Home page, events) - each only when its collection is still empty
if (process.env.MONGO_URI) {
  connectDB()
    .then(async () => {
      await Notice.seed();
      await Facility.seed();
      await FacilitiesPage.seed();
      await HomeContent.seed();
      await Event.seed();
      await EventsPage.seed();
      await SiteSettings.seed();
      await ContactPage.seed();
      const settings = await SiteSettings.findOne().lean();
      await Media.seed(settings?.socialLinks || []);
    })
    .catch((error) => console.log("Seeding failed:", error.message));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));