import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './pages/layout/Layout';
import StudentList from './pages/students/StudentList';
import StudentDetail from './pages/students/StudentDetail';
import StudentCourseList from './pages/studentCourse/StudentCourseList';
import CourseList from './pages/courses/CourseList';
import EnrollmentList from './pages/enrollments/EnrollmentList';
import Login from './pages/auth/Login';
import Profile from './pages/profile/Profile';
import AdminList from './pages/admins/AdminList';
import AdminDetail from './pages/admins/AdminDetail';
import CourseDetail from './pages/courses/CourseDetail';
import Register from './pages/auth/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/student-courses" element={<StudentCourseList />} />
            <Route path="/admins" element={<AdminList />} />
            <Route path="/admins/:id" element={<AdminDetail />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/enrollments" element={<EnrollmentList />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
