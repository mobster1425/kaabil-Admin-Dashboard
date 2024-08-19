import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './App.css';
import MessageCrudTable from './Messages';
import MessageCrudDetails from './MessagesDetails';
import UserCrudDetails from "./UserDetails";
import UserCrudTable from "./Users";
import CourseCrudDetails from "./CourseDetails";
import CourseCrudTable from "./Courses";
import QuestionCrudDetails from "./QuestionDetails";
import QuestionCrudTable from "./Questions";
import Navbar from "./Navbar";
import LoginPage from "./Login";
import QuestionCreate from "./QuestionCreate";
import QuestionEdit from "./QuestionEdit";
import CourseCreate from "./CourseCreate";
import CourseEdit from "./CourseEdit";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/login');
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <Router>
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/messages" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
          
          <Route path="/messages" element={<ProtectedRoute><MessageCrudTable /></ProtectedRoute>} />
          <Route path="/messages/:id" element={<ProtectedRoute><MessageCrudDetails /></ProtectedRoute>} />
          
          <Route path="/questions" element={<ProtectedRoute><QuestionCrudTable /></ProtectedRoute>} />
          <Route path="/questions/:questionId" element={<ProtectedRoute><QuestionCrudDetails /></ProtectedRoute>} />

          <Route path="/questions/create" element={<ProtectedRoute><QuestionCreate /></ProtectedRoute>} />
<Route path="/questions/edit/:questionId" element={<ProtectedRoute><QuestionEdit /></ProtectedRoute>} />
          
          <Route path="/users" element={<ProtectedRoute><UserCrudTable /></ProtectedRoute>} />
          <Route path="/user/:userId" element={<ProtectedRoute><UserCrudDetails /></ProtectedRoute>} />
          
          <Route path="/courses" element={<ProtectedRoute><CourseCrudTable /></ProtectedRoute>} />
          <Route path="/course/:subjectName" element={<ProtectedRoute><CourseCrudDetails /></ProtectedRoute>} />
          <Route path="/courses/create" element={<ProtectedRoute><CourseCreate /></ProtectedRoute>} />
          <Route path="/courses/edit/:subjectName" element={<ProtectedRoute><CourseEdit /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


/*


  return (
    <div className="App">
     <Router>
     <Navbar />

				<Routes>


					<Route exact path="/messages" element={<MessageCrudTable />} />					
					
					<Route exact path="/messages/:id" element={<MessageCrudDetails />} />
					
          <Route exact path="/questions" element={<QuestionCrudTable />} />					
					
					<Route exact path="/questions/:questionId" element={<QuestionCrudDetails />} />

          <Route exact path="/users" element={<UserCrudTable />} />					
					
					<Route exact path="/user/:userId" element={<UserCrudDetails />} />
					
          <Route exact path="/courses" element={<CourseCrudTable />} />					
					
					<Route exact path="/course/:subjectName" element={<CourseCrudDetails />} />
					
				</Routes>

			</Router>
    </div>
  );


*/