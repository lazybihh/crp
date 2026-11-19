// App.jsx - the route table: Preloader + Navbar around the pages. Every menu path without a real page yet shows the Placeholder.
import { Routes, Route, useLocation } from "react-router-dom";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; 
import Home from "./pages/home/Home";
import Placeholder from "./pages/placeholder/Placeholder";
import History from "./pages/about/History";
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
import AdminMandatoryDisclosure from "./pages/admin/AdminMandatoryDisclosure";
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
import AdminResourcesApplied from "./pages/admin/AdminResourcesApplied";
import AdminResourcesCivil from "./pages/admin/AdminResourcesCivil";
import AdminResourcesComputer from "./pages/admin/AdminResourcesComputer";
import AdminResourcesElectrical from "./pages/admin/AdminResourcesElectrical";
import AdminResourcesElectronics from "./pages/admin/AdminResourcesElectronics";
import AdminResourcesMechanical from "./pages/admin/AdminResourcesMechanical";
import AdminResourcesPlastic from "./pages/admin/AdminResourcesPlastic";
import AdminDeptCivil from "./pages/admin/AdminDeptCivil";
import AdminDeptComputer from "./pages/admin/AdminDeptComputer";
import AdminDeptElectrical from "./pages/admin/AdminDeptElectrical";
import AdminDeptElectronics from "./pages/admin/AdminDeptElectronics";
import AdminDeptMechanical from "./pages/admin/AdminDeptMechanical";
import AdminDeptPlastic from "./pages/admin/AdminDeptPlastic";
import AdminDeptApplied from "./pages/admin/AdminDeptApplied";
import AdminDeptWorkshop from "./pages/admin/AdminDeptWorkshop";
import AdminDeptAdministrative from "./pages/admin/AdminDeptAdministrative";
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
  "/about/mandatory-disclosure": "Mandatory disclosure",
  "/about/annual-report": "Annual report",
  "/students/academic-calendar": "Academic calendar",
};
const placeholderPaths = Object.keys(routeLabels);

export default function App() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/admin")) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/enquiries" element={<AdminEnquiries />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/notices" element={<AdminNotices />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/about/history" element={<AdminHistory />} />
        <Route path="/admin/about/principal-message" element={<AdminPrincipalMessage />} />
        <Route path="/admin/about/rank-accreditation" element={<AdminRankAccreditation />} />
        <Route path="/admin/about/alumni" element={<AdminAlumni />} />
        <Route path="/admin/about/courses" element={<AdminCourses />} />
        <Route path="/admin/about/results" element={<AdminResults />} />
        <Route path="/admin/about/placements" element={<AdminPlacements />} />
        <Route path="/admin/about/entrepreneurship" element={<AdminEntrepreneurship />} />
        <Route path="/admin/about/annual-report" element={<AdminAnnualReport />} />
        <Route path="/admin/about/mandatory-disclosure" element={<AdminMandatoryDisclosure />} />
        <Route path="/admin/about/luminaries" element={<AdminLuminaries />} />
        <Route path="/admin/about/projects" element={<AdminProjects />} />
        <Route path="/admin/about/extracurricular" element={<AdminExtracurricular />} />
        <Route path="/admin/about/unnat-bharat-abhiyan" element={<AdminUnnatBharat />} />
        <Route path="/admin/about/facilities" element={<AdminFacilities />} />
        <Route path="/admin/about/contact" element={<AdminContact />} />
        <Route path="/admin/students/admissions" element={<AdminAdmissions />} />
        <Route path="/admin/students/academic-calendar" element={<AdminAcademicCalendar />} />
        <Route path="/admin/students/online-learning" element={<AdminOnlineLearning />} />
        <Route path="/admin/students/helpline" element={<AdminHelpline />} />
        <Route path="/admin/students/grievance" element={<AdminGrievance />} />
        <Route path="/admin/students/e-services" element={<AdminEServices />} />
        <Route path="/admin/students/skill-courses" element={<AdminSkillCourses />} />
        <Route path="/admin/students/freelancing" element={<AdminFreelancing />} />
        <Route path="/admin/students/incubator" element={<AdminIncubator />} />
        <Route path="/admin/students/apprenticeship" element={<AdminApprenticeship />} />
        <Route path="/admin/students/ncc-nss" element={<AdminNccNss />} />
        <Route path="/admin/students/departments/applied-science" element={<AdminResourcesApplied />} />
        <Route path="/admin/students/departments/civil" element={<AdminResourcesCivil />} />
        <Route path="/admin/students/departments/computer" element={<AdminResourcesComputer />} />
        <Route path="/admin/students/departments/electrical" element={<AdminResourcesElectrical />} />
        <Route path="/admin/students/departments/electronics" element={<AdminResourcesElectronics />} />
        <Route path="/admin/students/departments/mechanical" element={<AdminResourcesMechanical />} />
        <Route path="/admin/students/departments/plastic" element={<AdminResourcesPlastic />} />
        <Route path="/admin/departments/civil" element={<AdminDeptCivil />} />
        <Route path="/admin/departments/computer" element={<AdminDeptComputer />} />
        <Route path="/admin/departments/electrical" element={<AdminDeptElectrical />} />
        <Route path="/admin/departments/electronics" element={<AdminDeptElectronics />} />
        <Route path="/admin/departments/mechanical" element={<AdminDeptMechanical />} />
        <Route path="/admin/departments/plastic" element={<AdminDeptPlastic />} />
        <Route path="/admin/departments/applied-science" element={<AdminDeptApplied />} />
        <Route path="/admin/departments/workshop" element={<AdminDeptWorkshop />} />
        <Route path="/admin/departments/administrative" element={<AdminDeptAdministrative />} />
        <Route path="/admin/faculty/training-policy" element={<AdminTrainingPolicy />} />
        <Route path="/admin/faculty/anti-ragging" element={<AdminAntiRagging />} />
        <Route path="/admin/faculty/anti-sexual-harassment" element={<AdminAntiSexualHarassment />} />
        <Route path="/admin/faculty/service-rules" element={<AdminServiceRules />} />
        <Route path="/admin/faculty/iqac" element={<AdminIqac />} />
        <Route path="/admin/faculty/e-services" element={<AdminFacultyEServices />} />
        <Route path="/admin/media/photos" element={<AdminPhotos />} />
        <Route path="/admin/media/videos" element={<AdminVideos />} />
        <Route path="/admin/media/social" element={<AdminSocialLinks />} />
        <Route path="/admin/site-settings" element={<AdminSiteSettings />} />
        <Route path="*" element={<AdminDashboard />} />
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
