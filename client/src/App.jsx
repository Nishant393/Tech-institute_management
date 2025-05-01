import "./globals.css";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NotFound from "./root/NotFound";

import SignUp from "./Auth/Auth_Pages/SignUp";
import SignIn from "./Auth/Auth_Pages/SingIn";
import Auth from "./Auth/Auth";

import Dashboard from "./root/adminPages/pages/Dashboard";
import AdminRoot from "./root/adminPages/AdminRoot";
import CourseManagement from "./root/adminPages/pages/CourseManagement";
import ProtectedAdminRoute from "./root/ProtectedAdminRoute";
import CreateCourse from "./root/adminPages/pages/CreateCourse";
import EditCourse from "./root/adminPages/pages/EditCourse";
import CourseContent from "./root/adminPages/pages/CourseContent";
import FeedbackManagement from "./root/adminPages/pages/FeedbackManagement";

import Home from "./root/userPages/pages/Home";
import UserRoot from "./root/userPages/UserRoot";
import ProtectedUserRoute from "./root/ProtectedUserRoute";
import Courses from "./root/userPages/pages/Courses";
import CourseDetail from "./root/userPages/pages/CourseDetail";
import Contact from "./root/userPages/pages/Contact";
import Profile from "./root/userPages/pages/Profile";
import CreateRecordedCourse from "./root/adminPages/pages/CreateRecordedCourse";
import EditRecordedCourse from "./root/adminPages/pages/EditRecordedCourse";
import RecordedCourseManagement from "./root/adminPages/pages/RecordedCourseManagement";
import RecordedCourseDetails from "./root/adminPages/pages/RecordedCourseDetails";
import Communications from "./root/adminPages/pages/Communications";


const App = () => {
  return (
    <>
      <main className="h-screen flex">
        <Routes>

          <Route element={<Auth />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>
          <Route element={<ProtectedUserRoute />}>

            <Route element={<UserRoot />}>
              <Route index element={<Home />} />
              <Route path="courses" element={<Courses />} />
              <Route path="course/:courseId" element={<CourseDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={<Profile />} />



              {/*
            <Route path="recorded-courses" element={<RecordedCourses />} />
            <Route path="recorded-courses/:courseId" element={<RecordedCourseDetail />} />
            <Route path="my-learning" element={<MyLearning />} />
            <Route path="my-learning" element={<MyLearning />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="support" element={<Support />} /> */}
            </Route>
          </Route>

          <Route element={<ProtectedAdminRoute />} >
            <Route path="/admin" element={<AdminRoot />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="courses/create" element={<CreateCourse />} />
              <Route path="courses/edit/:courseId" element={<EditCourse />} />
              <Route path="courses/content/:courseId" element={<CourseContent />} />
              <Route path="feedback" element={<FeedbackManagement />} />

              <Route path="recorded" element={< RecordedCourseManagement/>} />
              <Route path="recorded/create" element={<CreateRecordedCourse />} />
              <Route path="recorded/edit/:courseId" element={<EditRecordedCourse />} />
              <Route path="recorded/content/:courseId" element={<RecordedCourseDetails />} />
              <Route path="communications" element={<Communications />} />
              {/*
              <Route path="user-management" element={<CreateRecordedCourse />} />
                <Route path="recorded-courses" element={<RecordedCourseManagement />} />
                <Route path="recorded-courses/create" element={<CreateRecordedCourse />} />
                <Route path="recorded-courses/edit/:courseId" element={<EditRecordedCourse />} />
                <Route path="recorded-courses/content/:courseId" element={<RecordedCourseContent />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="students/profile/:studentId" element={<StudentProfile />} />
              <Route path="students/enrollment" element={<EnrollmentManagement />} />
              <Route path="students/progress" element={<ProgressTracking />} />
              <Route path="website-customization" element={<WebsiteCustomization />} />
              */}
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster position="top-center" />
    </>
  );
};

export default App;
