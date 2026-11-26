// App.jsx - the route table: Preloader + Navbar around the pages. Every menu path without a real page yet shows the Placeholder.
import { Routes, Route, useLocation } from "react-router-dom";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; 
import Home from "./pages/home/Home";
import Placeholder from "./pages/placeholder/Placeholder";
import History from "./pages/about/History";
import AnnualReport from "./pages/about/AnnualReport";
import PrincipalMessage from "./pages/about/PrincipalMessage";
import RankAccreditation from "./pages/about/RankAccreditation";
import Alumni from "./pages/about/Alumni";
import Results from "./pages/about/Results";
import Entrepreneurship from "./pages/about/Entrepreneurship";
import Placements from "./pages/about/Placements";
import Courses from "./pages/about/Courses";
import Facilities from "./pages/about/Facilities";
import Luminaries from "./pages/about/Luminaries";
import Projects from "./pages/about/Projects";
import Extracurricular from "./pages/about/Extracurricular";
import UnnatBharatAbhiyan from "./pages/about/UnnatBharatAbhiyan";
import Gallery from "./pages/media/Gallery";
import Videos from "./pages/media/Videos";
import SocialLinks from "./pages/media/SocialLinks";
import Admissions from "./pages/students/Admissions";
import OnlineLearning from "./pages/students/OnlineLearning";
import SkillCourses from "./pages/students/SkillCourses";
import Freelancing from "./pages/students/Freelancing";
import Incubator from "./pages/students/Incubator";
import Apprenticeship from "./pages/students/Apprenticeship";
import NccNss from "./pages/students/NccNss";
import StudentHelpline from "./pages/students/StudentHelpline";
import GrievanceRedressal from "./pages/students/GrievanceRedressal";
import EServices from "./pages/students/EServices";
import ComputerResources from "./pages/students/ComputerResources";
import PlasticResources from "./pages/students/PlasticResources";
import AppliedSciencesResources from "./pages/students/AppliedSciencesResources";
import CivilResources from "./pages/students/CivilResources";
import ElectricalResources from "./pages/students/ElectricalResources";
import ElectronicsResources from "./pages/students/ElectronicsResources";
import MechanicalResources from "./pages/students/MechanicalResources";
import Notices from "./pages/notices/Notices";
import Events from "./pages/events/Events";
import Contact from "./pages/about/Contact";
import AcademicCalendar from "./pages/students/AcademicCalendar";
import TrainingPolicy from "./pages/faculty/TrainingPolicy";
import AntiRagging from "./pages/faculty/AntiRagging";
import AntiSexualHarassment from "./pages/faculty/AntiSexualHarassment";
import ServiceRules from "./pages/faculty/ServiceRules";
import IQAC from "./pages/faculty/IQAC";
import FacultyEServices from "./pages/faculty/FacultyEServices";
import Computer from "./pages/faculty/Computer";
import Electrical from "./pages/faculty/Electrical";
import Civil from "./pages/faculty/Civil";
import Electronics from "./pages/faculty/Electronics";
import AppliedSciences from "./pages/faculty/AppliedSciences";
import Mechanical from "./pages/faculty/Mechanical";
import Plastic from "./pages/faculty/Plastic";
import Workshop from "./pages/faculty/Workshop";
import Administrative from "./pages/faculty/Administrative";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import RequireAdmin from "./components/RequireAdmin";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminHome from "./pages/admin/AdminHome";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminHistory from "./pages/admin/AdminHistory";
import AdminPrincipalMessage from "./pages/admin/AdminPrincipalMessage";
import AdminRankAccreditation from "./pages/admin/AdminRankAccreditation";
import AdminAlumni from "./pages/admin/AdminAlumni";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminResults from "./pages/admin/AdminResults";
import AdminPlacements from "./pages/admin/AdminPlacements";
import AdminEntrepreneurship from "./pages/admin/AdminEntrepreneurship";
import AdminAnnualReport from "./pages/admin/AdminAnnualReport";
import AdminLuminaries from "./pages/admin/AdminLuminaries";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminExtracurricular from "./pages/admin/AdminExtracurricular";
import AdminUnnatBharat from "./pages/admin/AdminUnnatBharat";
import AdminFacilities from "./pages/admin/AdminFacilities";
import AdminContact from "./pages/admin/AdminContact";
import AdminAdmissions from "./pages/admin/AdminAdmissions";
import AdminAcademicCalendar from "./pages/admin/AdminAcademicCalendar";
import AdminOnlineLearning from "./pages/admin/AdminOnlineLearning";
import AdminHelpline from "./pages/admin/AdminHelpline";
import AdminGrievance from "./pages/admin/AdminGrievance";
import AdminEServices from "./pages/admin/AdminEServices";
import AdminSkillCourses from "./pages/admin/AdminSkillCourses";
import AdminFreelancing from "./pages/admin/AdminFreelancing";
import AdminIncubator from "./pages/admin/AdminIncubator";
import AdminApprenticeship from "./pages/admin/AdminApprenticeship";
import AdminNccNss from "./pages/admin/AdminNccNss";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminStudyResources from "./pages/admin/AdminStudyResources";
import AdminTrainingPolicy from "./pages/admin/AdminTrainingPolicy";
import AdminAntiRagging from "./pages/admin/AdminAntiRagging";
import AdminAntiSexualHarassment from "./pages/admin/AdminAntiSexualHarassment";
import AdminServiceRules from "./pages/admin/AdminServiceRules";
import AdminIqac from "./pages/admin/AdminIqac";
import AdminFacultyEServices from "./pages/admin/AdminFacultyEServices";
import AdminPhotos from "./pages/admin/AdminPhotos";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminSocialLinks from "./pages/admin/AdminSocialLinks";
import AdminSiteSettings from "./pages/admin/AdminSiteSettings";

const routeLabels = {
};
const placeholderPaths = Object.keys(routeLabels);

export default function App() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/admin")) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/enquiries" element={<RequireAdmin><AdminEnquiries /></RequireAdmin>} />
        <Route path="/admin/home" element={<RequireAdmin><AdminHome /></RequireAdmin>} />
        <Route path="/admin/notices" element={<RequireAdmin><AdminNotices /></RequireAdmin>} />
        <Route path="/admin/events" element={<RequireAdmin><AdminEvents /></RequireAdmin>} />
        <Route path="/admin/about/history" element={<RequireAdmin><AdminHistory /></RequireAdmin>} />
        <Route path="/admin/about/principal-message" element={<RequireAdmin><AdminPrincipalMessage /></RequireAdmin>} />
        <Route path="/admin/about/rank-accreditation" element={<RequireAdmin><AdminRankAccreditation /></RequireAdmin>} />
        <Route path="/admin/about/alumni" element={<RequireAdmin><AdminAlumni /></RequireAdmin>} />
        <Route path="/admin/about/courses" element={<RequireAdmin><AdminCourses /></RequireAdmin>} />
        <Route path="/admin/about/results" element={<RequireAdmin><AdminResults /></RequireAdmin>} />
        <Route path="/admin/about/placements" element={<RequireAdmin><AdminPlacements /></RequireAdmin>} />
        <Route path="/admin/about/entrepreneurship" element={<RequireAdmin><AdminEntrepreneurship /></RequireAdmin>} />
        <Route path="/admin/about/annual-report" element={<RequireAdmin><AdminAnnualReport /></RequireAdmin>} />
        <Route path="/admin/about/luminaries" element={<RequireAdmin><AdminLuminaries /></RequireAdmin>} />
        <Route path="/admin/about/projects" element={<RequireAdmin><AdminProjects /></RequireAdmin>} />
        <Route path="/admin/about/extracurricular" element={<RequireAdmin><AdminExtracurricular /></RequireAdmin>} />
        <Route path="/admin/about/unnat-bharat-abhiyan" element={<RequireAdmin><AdminUnnatBharat /></RequireAdmin>} />
        <Route path="/admin/about/facilities" element={<RequireAdmin><AdminFacilities /></RequireAdmin>} />
        <Route path="/admin/about/contact" element={<RequireAdmin><AdminContact /></RequireAdmin>} />
        <Route path="/admin/students/admissions" element={<RequireAdmin><AdminAdmissions /></RequireAdmin>} />
        <Route path="/admin/students/academic-calendar" element={<RequireAdmin><AdminAcademicCalendar /></RequireAdmin>} />
        <Route path="/admin/students/online-learning" element={<RequireAdmin><AdminOnlineLearning /></RequireAdmin>} />
        <Route path="/admin/students/helpline" element={<RequireAdmin><AdminHelpline /></RequireAdmin>} />
        <Route path="/admin/students/grievance" element={<RequireAdmin><AdminGrievance /></RequireAdmin>} />
        <Route path="/admin/students/e-services" element={<RequireAdmin><AdminEServices /></RequireAdmin>} />
        <Route path="/admin/students/skill-courses" element={<RequireAdmin><AdminSkillCourses /></RequireAdmin>} />
        <Route path="/admin/students/freelancing" element={<RequireAdmin><AdminFreelancing /></RequireAdmin>} />
        <Route path="/admin/students/incubator" element={<RequireAdmin><AdminIncubator /></RequireAdmin>} />
        <Route path="/admin/students/apprenticeship" element={<RequireAdmin><AdminApprenticeship /></RequireAdmin>} />
        <Route path="/admin/students/ncc-nss" element={<RequireAdmin><AdminNccNss /></RequireAdmin>} />
        <Route path="/admin/departments" element={<RequireAdmin><AdminDepartments /></RequireAdmin>} />
        <Route path="/admin/students/study-resources" element={<RequireAdmin><AdminStudyResources /></RequireAdmin>} />
        <Route path="/admin/faculty/training-policy" element={<RequireAdmin><AdminTrainingPolicy /></RequireAdmin>} />
        <Route path="/admin/faculty/anti-ragging" element={<RequireAdmin><AdminAntiRagging /></RequireAdmin>} />
        <Route path="/admin/faculty/anti-sexual-harassment" element={<RequireAdmin><AdminAntiSexualHarassment /></RequireAdmin>} />
        <Route path="/admin/faculty/service-rules" element={<RequireAdmin><AdminServiceRules /></RequireAdmin>} />
        <Route path="/admin/faculty/iqac" element={<RequireAdmin><AdminIqac /></RequireAdmin>} />
        <Route path="/admin/faculty/e-services" element={<RequireAdmin><AdminFacultyEServices /></RequireAdmin>} />
        <Route path="/admin/media/photos" element={<RequireAdmin><AdminPhotos /></RequireAdmin>} />
        <Route path="/admin/media/videos" element={<RequireAdmin><AdminVideos /></RequireAdmin>} />
        <Route path="/admin/media/social" element={<RequireAdmin><AdminSocialLinks /></RequireAdmin>} />
        <Route path="/admin/site-settings" element={<RequireAdmin><AdminSiteSettings /></RequireAdmin>} />
        <Route path="*" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      </Routes>
    );
  }

  return (
    <>
      <Preloader />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about/history" element={<History />} />
        <Route path="/about/annual-report" element={<AnnualReport />} />
        <Route path="/about/principal-message" element={<PrincipalMessage />} />
        <Route path="/about/rank-accreditation" element={<RankAccreditation />} />
        <Route path="/about/alumni" element={<Alumni />} />
        <Route path="/about/results" element={<Results />} />
        <Route path="/about/entrepreneurship" element={<Entrepreneurship />} />
        <Route path="/about/placements" element={<Placements />} />
        <Route path="/about/courses" element={<Courses />} />
        <Route path="/about/facilities" element={<Facilities />} />
        <Route path="/about/luminaries" element={<Luminaries />} />
        <Route path="/about/projects" element={<Projects />} />
        <Route path="/about/extracurricular" element={<Extracurricular />} />
        <Route path="/about/unnat-bharat-abhiyan" element={<UnnatBharatAbhiyan />} />
        <Route path="/media/photos" element={<Gallery />} />
        <Route path="/media/videos" element={<Videos />} />
        <Route path="/media/social" element={<SocialLinks />} />
        <Route path="/students/admissions" element={<Admissions />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/students/academic-calendar" element={<AcademicCalendar />} />
        <Route path="/students/online-learning" element={<OnlineLearning />} />
        <Route path="/students/skill-courses" element={<SkillCourses />} />
        <Route path="/students/freelancing" element={<Freelancing />} />
        <Route path="/students/incubator" element={<Incubator />} />
        <Route path="/students/apprenticeship" element={<Apprenticeship />} />
        <Route path="/students/ncc-nss" element={<NccNss />} />
        <Route path="/students/helpline" element={<StudentHelpline />} />
        <Route path="/students/grievance" element={<GrievanceRedressal />} />
        <Route path="/students/e-services" element={<EServices />} />
        <Route path="/students/departments/computer" element={<ComputerResources />} />
        <Route path="/students/departments/plastic" element={<PlasticResources />} />
        <Route path="/students/departments/applied-science" element={<AppliedSciencesResources />} />
        <Route path="/students/departments/civil" element={<CivilResources />} />
        <Route path="/students/departments/electrical" element={<ElectricalResources />} />
        <Route path="/students/departments/electronics" element={<ElectronicsResources />} />
        <Route path="/students/departments/mechanical" element={<MechanicalResources />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about/contact" element={<Contact />} />
        <Route path="/faculty/training-policy" element={<TrainingPolicy />} />
        <Route path="/faculty/anti-ragging" element={<AntiRagging />} />
        <Route path="/faculty/anti-sexual-harassment" element={<AntiSexualHarassment />} />
        <Route path="/faculty/service-rules" element={<ServiceRules />} />
        <Route path="/faculty/iqac" element={<IQAC />} />
        <Route path="/faculty/e-services" element={<FacultyEServices />} />
        <Route path="/departments/computer" element={<Computer />} />
        <Route path="/departments/electrical" element={<Electrical />} />
        <Route path="/departments/civil" element={<Civil />} />
        <Route path="/departments/electronics" element={<Electronics />} />
        <Route path="/departments/applied-science" element={<AppliedSciences />} />
        <Route path="/departments/mechanical" element={<Mechanical />} />
        <Route path="/departments/plastic" element={<Plastic />} />
        <Route path="/departments/workshop" element={<Workshop />} />
        <Route path="/departments/administrative" element={<Administrative />} />
        {placeholderPaths.map((path) => <Route key={path} path={path} element={<Placeholder routeLabels={routeLabels} />} />)}
        <Route path="/departments/:id" element={<Placeholder routeLabels={routeLabels} />} />
        <Route path="*" element={<Placeholder notFound routeLabels={routeLabels} />} />
      </Routes>
      <Footer />
    </>
  );
}
