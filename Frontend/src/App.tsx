import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import LogIn from "./components/login"
import MainPage from "./components/main-page"
import Statistics from "./components/statistics"
import ManageUsers from "./components/ManageUsers"
import AdminDashboard from "./components/AdminDashboard"
import ManageDonationPage from './components/ManageDonations';
import Profile from './components/Profile';
import AboutPage from './components/aboutPage';
import UploadProduct from './components/UploadProduct';
import  UploadRequestedProduct  from './components/upload-requested-product';
import ManageRequestedDonations from './components/ManageRequestedDonations';
import NewLiveDonation from './components/newLiveDonation';
import ManageMainPageUsers from './components/ManageMainPageUsers';
import EditRequestedProduct from './components/edit-requested-product';
import {Navbar} from "./components//Navbar";
import { useState } from 'react';
import { User } from './services/types';
import Footer from './components/Footer'
import './styles/globals.css';


const App = () => {
    const [user, setUser] = useState<User | null>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null);

    return (
        
            <div style={{ height: "100vh" }}>
       <div className="App">
        <div className="main-content">
        <Router>
            
            <Navbar user={user} setUser={setUser} googleSignIn={false} />
            
            <Routes>
                <Route path="/" element={<Navigate to="/profile" replace />} />

                <Route path="/login" element={<LogIn />} />
                <Route path="/mainPage" element={<MainPage />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/uploadRequestedProduct" element={<UploadRequestedProduct />} />
                <Route path="/manageUsers" element={<ManageUsers />} />
                <Route path= "/newLiveDonation" element={<NewLiveDonation />} />
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/manageDonations" element={<ManageDonationPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/uploadproduct" element={<UploadProduct />} />
                <Route path="/manageDonations" element={<ManageDonationPage />} />
                <Route path="/manageUsers" element={<ManageUsers />} />   
                <Route path="/manageRequestedDonations" element={<ManageRequestedDonations />} />
                <Route path="/manageMainPageUsers" element={<ManageMainPageUsers />} /> 
                <Route path="/editRequestedProduct" element={<EditRequestedProduct />} />                          
            </Routes>
        </Router>
        </div>
        <Footer />
        </div>
        </div>
      
        
    );
}

export default App;
