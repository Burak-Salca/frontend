import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import StudentList from './components/students/StudentList';
import StudentDetail from './components/students/StudentDetail';
import StudentCourseList from './components/students/StudentCourseList';
import CourseList from './components/courses/CourseList';
import EnrollmentList from './components/enrollments/EnrollmentList';
import Login from './components/auth/Login';
import Profile from './components/profile/Profile';
import AdminList from './components/admins/AdminList';
import CourseDetail from './components/courses/CourseDetail';
import Register from './components/auth/Register';

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
