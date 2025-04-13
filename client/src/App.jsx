import "./globals.css";
import { Route, Routes } from "react-router-dom";
import SignUp from "./Auth/Auth_Pages/SignUp";
import SignIn from "./Auth/Auth_Pages/SingIn";
import Auth from "./Auth/Auth";
import { Toaster } from "react-hot-toast";
import Dashboard from "./root/adminPages/pages/Dashboard";
import UserRoot from "./root/userPages/UserRoot";
import Home from "./root/userPages/pages/Home";
import AdminRoot from "./root/adminPages/AdminRoot";
import CourseManagement from "./root/adminPages/pages/CourseManagement";
import ProtectedAdminRoute from "./root/ProtectedAdminRoute";
import CreateCourse from "./root/adminPages/pages/CreateCourse";




const App = () => {
  return (
    <>
      <main className="h-screen flex">
        <Routes>

          <Route element={<Auth />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>

          <Route element={<UserRoot />}>
            <Route index element={<Home />} />
          </Route>

          <Route element={<ProtectedAdminRoute />} >
            <Route path="/admin" element={<AdminRoot />}>
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="courses" element={<CourseManagement />} />
               <Route path="courses/create" element={<CreateCourse />} />
              
            <Route path="courses/edit/:courseId" element={<EditCourse />} />
             {/*
            <Route path="courses/content/:courseId" element={<CourseContent />} />

            <Route path="students" element={<StudentManagement />} />
            <Route path="students/profile/:studentId" element={<StudentProfile />} />
            <Route path="students/enrollment" element={<EnrollmentManagement />} />
            <Route path="students/progress" element={<ProgressTracking />} />

            <Route path="communications" element={<Communications />} />

            <Route path="user-management" element={<UserRoleManagement />} />

            <Route path="website-customization" element={<WebsiteCustomization />} />

            <Route path="feedback" element={<FeedbackManagement />} /> */}
            </Route>


          </Route>
        </Routes>
      </main>
      <Toaster position="top-center" />
    </>
  );
};

export default App;
