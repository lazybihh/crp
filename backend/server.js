
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

const Notice = require("./models/Notice");
const Facility = require("./models/Facility");
const { FacilitiesPage } = Facility;
const HomeContent = require("./models/HomeContent");
const Event = require("./models/Event");
const ContactPage = require("./models/ContactPage");
const { EventsPage } = Event;
const SiteSettings = require("./models/SiteSettings");
const Media = require("./models/Media");
const Department = require("./models/Department");
const StudyResource = require("./models/StudyResource");

// Faculty backend models
const FacultyPolicy = require("./models/FacultyPolicy");
const FacultyService = require("./models/FacultyService");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Existing API routes
app.use("/api/home", require("./routes/HomeRoutes"));
app.use("/api/departments", require("./routes/DepartmentRoutes"));
app.use("/api/study-resources", require("./routes/StudyResourceRoutes"));
app.use("/api/facilities", require("./routes/FacilityRoutes"));
app.use("/api/events", require("./routes/EventRoutes"));
app.use("/api/notices", require("./routes/NoticeRoutes"));
app.use("/api/uploads", require("./routes/uploadsRoutes"));
app.use("/api/settings", require("./routes/SettingsRoutes"));
app.use("/api/media", require("./routes/MediaRoutes"));
app.use("/api/enquiries", require("./routes/EnquiryRoutes"));
app.use("/api/contact-page", require("./routes/ContactPageRoutes"));

// Faculty API routes
app.use("/api/faculty/policies", require("./routes/FacultyPolicyRoutes"));
app.use("/api/faculty/services", require("./routes/FacultyServiceRoutes"));

app.get("/", (req, res) => {
  res.send("Chhotu Ram Polytechnic API is running!");
});

// Database connection and initial data
if (process.env.MONGO_URI) {
  connectDB()
    .then(async () => {
      await Notice.seed();
      await Facility.seed();
      await FacilitiesPage.seed();
      await HomeContent.seed();
      await Department.seed();
      await StudyResource.seed();
      await Event.seed();
      await EventsPage.seed();
      await SiteSettings.seed();
      await ContactPage.seed();

      // Seed faculty content (only inserts missing records)
      await FacultyPolicy.seed();
      await FacultyService.seed();

      const settings = await SiteSettings.findOne().lean();
      await Media.seed(settings?.socialLinks || []);

      console.log("All database content seeded successfully.");
    })
    .catch((error) => console.log("Seeding failed:", error.message));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
