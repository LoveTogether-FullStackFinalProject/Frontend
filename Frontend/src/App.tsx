import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import LogIn from "./components/login"
import MainPage from "./components/main-page"
import Statictics from "./components/statistics"
import ManageUsers from "./components/ManageUsers"
import AdminDashboard from "./components/AdminDashboard"
import ManageDonationPage from './components/ManageDonations';
import Profile from './components/Profile';
import AboutPage from './components/aboutPage';
import UploadProduct from './components/UploadProduct';
import  UploadRequestedProduct  from './components/upload-requested-product';
import { Navbar } from "./components//Navbar";
import { useState } from 'react';
import { User } from './services/types';
import Footer from './components/Footer'


const App = () => {
    const [user, setUser] = useState<User | null>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null);

    return (
       <div className="App">
        <div className="main-content">
        <Router>
             <Footer />
            <Navbar user={user} setUser={setUser} googleSignIn={false} />
            
            <Routes>
                <Route path="/" element={<Navigate to="/profile" replace />} />

                <Route path="/login" element={<LogIn />} />
                <Route path="/mainPage" element={<MainPage />} />
                <Route path="/statictics" element={<Statictics />} />
                <Route path="/uploadRequestedProduct" element={<UploadRequestedProduct />} />
                <Route path="/manageUsers" element={<ManageUsers />} />
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/manageDonations" element={<ManageDonationPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/uploadproduct" element={<UploadProduct />} />
                <Route path="/manageDonations" element={<ManageDonationPage />} />              
            </Routes>
        </Router>
        </div>
        <Footer />
        </div>
        
    );
}

export default App;
