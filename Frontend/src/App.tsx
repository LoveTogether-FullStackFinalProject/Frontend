// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import MainPage from "./components/main-page"
// import LogIn from "./components/login"
// //import Statictics from "./components/statistics"
// // import AdminDashboard from "./components/AdminDashbord"
// // import Registration from "./components/Registration"
// // import UploadProduct from "./components/UploadProduct"

// function App() {
//   return (
//     <div className="p-2">
//       <LogIn />
//     </div>
//   )
// }


//export default App

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import LogIn from "./components/login"
import MainPage from "./components/main-page"
import Statictics from "./components/statistics"
import ManageUsers from "./components/ManageUsers"
import AdminDashboard from "./components/AdminDashboard"
import ManageDonationPage from './components/ManageDonations';
import UploadProduct from './components/UploadProduct';


const App = () => {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Navigate to="/uploadproduct" replace />} />

                <Route path="/login" element={<LogIn />} />
                <Route path="/mainPage" element={<MainPage />} />
                <Route path="/statictics" element={<Statictics />} />
                <Route path="/manageUsers" element={<ManageUsers />} />
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/uploadproduct" element={<UploadProduct />} />
                <Route path="/manageDonations" element={<ManageDonationPage />} />              
            </Routes>
        </Router>
    );
}

export default App;
