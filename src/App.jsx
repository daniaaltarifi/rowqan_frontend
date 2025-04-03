
import './App.css'
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes,Route, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Component/Header'
import Footer from './Component/Footer';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
const Home=React.lazy(()=>import('./Pages/Home.jsx'))
const SignUp=React.lazy(()=>import('./Pages/SignUp.jsx'))
const Login=React.lazy(()=>import('./Pages/Login.jsx'))
const Chalets=React.lazy(()=>import('./Pages/Chalets.jsx'))
const ForgetPassword=React.lazy(()=>import('./Pages/ForgetPassword.jsx'))
const ResetPassword=React.lazy(()=>import('./Pages/ResetPassword.jsx'))
const ChaletsDetails=React.lazy(()=>import('./Pages/ChaletDetails.jsx'))
const BookingChalets=React.lazy(()=>import('./Pages/BookingChalets.jsx'))
const ReserveChalets=React.lazy(()=>import('./Pages/ReserveChalets.jsx'))
const CashBack=React.lazy(()=>import('./Pages/CashBack.jsx'))
const ChatBot=React.lazy(()=>import('./Component/ChatBot.jsx'))
const Payment=React.lazy(()=>import('./Pages/Payment.jsx'))
const About=React.lazy(()=>import('./Pages/About.jsx'))
const Blogs=React.lazy(()=>import('./Pages/Blogs.jsx'))
const BlogDetails=React.lazy(()=>import('./Pages/BlogDetails.jsx'))
const Contact=React.lazy(()=>import('./Pages/Contact.jsx'))
const Offers=React.lazy(()=>import('./Pages/Offers.jsx'))
const LetRowqanChoose = React.lazy(()=>import('./Pages/LetRowqanChoose.jsx'))

import { UserProvider } from './Component/UserContext.jsx';

    // EVENTS IMPORTS
// import Events from './Pages/Events';
// import EventsCategory from './Pages/EventsCategory';
// import EventDetails from './Pages/EventDetails';
// import ReserveEvents from './Pages/ReserveEvents';
   // LANDS IMPORTS
// import Lands from './Pages/Lands';
// import LandsDetails from './Pages/LandsDetails';
// import BookingLand from './Pages/BookingLand';
// import Playgrounds from './Pages/Playgrounds';
//  export const API_URL="http://localhost:5000";
 export const API_URL="https://rowqanbackend.rowqan.com";
const DirectionHandler = () => {
  const location = useLocation();
  const lang = location.pathname.split("/")[1] || "en";

  useEffect(() => {
    document.body.classList.remove("ltr", "rtl");
    document.body.classList.add(lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  return null;
};
function App() {
  const initialOptions = {
    "client-id": "ARspiEadSuarPJ25VpOsCA_fz6_GbGjX-zFG6Jcpa6YZozEF5AmPAej0DNP_Q1vWsnwXsDp92KG8e7Vz",
    currency: "USD",
    intent: "capture",
  };
  
  return (
    <>
    <Router>
      <DirectionHandler/>
    <UserProvider>
    <Header/>
    <PayPalScriptProvider options={initialOptions}>
    <Suspense fallback={<div>Loading...</div>}>

    <Routes>

      <Route path="/" element={ <Home/>} />
      <Route path="/:lang" element={ <Home/>} />
      <Route path="/:lang/signup" element={ <SignUp/>} />
      <Route path="/:lang/login" element={ <Login/>} />
      <Route path="/:lang/about" element={ <About/>} />
      <Route path="/:lang/blogs" element={ <Blogs/>} />
      <Route path="/:lang/blogdetails/:id" element={ <BlogDetails/>} />
      <Route path="/:lang/contact" element={ <Contact/>} />
      <Route path="/:lang/LetRowqanChoose" element={ <LetRowqanChoose/>} />
      {/* CHALETS ROUTES */}
      <Route path="/:lang/chalets" element={ <Chalets/>} />
      <Route path="/:lang/chaletdetails/:id" element={ <ChaletsDetails/>} />
      <Route path="/:lang/bookingchalet/:id" element={ <BookingChalets/>} />
      <Route path="/:lang/reservechalet/:id" element={ <ReserveChalets/>} />
      <Route path="/:lang/chatbot/:chalet_id" element={ <ChatBot/>} />
      <Route path="/:lang/payment/:reservation_id" element={ <Payment/>} />
      <Route path="/:lang/offers" element={ <Offers/>} />

      <Route path="/:lang/forgetpassword" element={ <ForgetPassword/>} />
      <Route path="/:lang/resetpassword/:token" element={ <ResetPassword/>} />
      {/* EVENTS ROUTES */}
      {/* <Route path="/:lang/events" element={ <Events/>} />
      <Route path="/:lang/eventscategory/:id" element={ <EventsCategory/>} />
      <Route path="/:lang/eventdetails/:id" element={ <EventDetails/>} />
      <Route path="/:lang/reserveevent/:id" element={ <ReserveEvents/>} /> */}
      {/* LANDS ROUTES */}
      {/* <Route path="/:lang/lands" element={ <Lands/>} />
      <Route path="/:lang/landdetails/:id" element={ <LandsDetails/>} />
      <Route path="/:lang/bookingland/:id" element={ <BookingLand/>} /> */}
      {/* PLAYGROUND ROUTES */}
      {/* <Route path="/:lang/playgrounds" element={ <Playgrounds/>} /> */}

      <Route path="/:lang/cashback" element={ <CashBack/>} />

    </Routes>
    </Suspense>
    </PayPalScriptProvider>

      </UserProvider>
    <Footer/>
    </Router>

    
    </>
  )
}

export default App
