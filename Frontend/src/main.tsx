import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="428869417199-vt16hq66lb1ltjgrm0vn7g68d4m957i3.apps.googleusercontent.com">
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </GoogleOAuthProvider>
)