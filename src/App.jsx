import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import StudentList from './components/students/StudentList';
import CourseList from './components/courses/CourseList';
import EnrollmentList from './components/enrollments/EnrollmentList';
import Login from './components/auth/Login';
import Profile from './components/profile/Profile';
import AdminList from './components/admins/AdminList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="/students" element={<StudentList />} />
            <Route path="/admins" element={<AdminList />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/enrollments" element={<EnrollmentList />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
