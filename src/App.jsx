
import './App.css'
import Header from './Component/Header'
import { BrowserRouter as Router, Routes,Route, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Component/Footer';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import Chalets from './Pages/Chalets';
import ForgetPassword from './Pages/ForgetPassword';
import ResetPassword from './Pages/ResetPassword';
import Events from './Pages/Events';
import { useEffect } from 'react';
import EventsCategory from './Pages/EventsCategory';
import EventDetails from './Pages/EventDetails';
import ChaletsDetails from './Pages/ChaletDetails';
import BookingChalets from './Pages/BookingChalets';
import Lands from './Pages/Lands';
import LandsDetails from './Pages/LandsDetails';
import BookingLand from './Pages/BookingLand';
import ReserveChalets from './Pages/ReserveChalets';
import ReserveEvents from './Pages/ReserveEvents';
import Playgrounds from './Pages/Playgrounds';
import { UserProvider } from './Component/UserContext.jsx';
import CashBack from './Pages/CashBack.jsx';
import ChatBot from './Component/ChatBot.jsx';
export const API_URL="http://localhost:5000";
// export const API_URL="https://rowqanbackend.rowqan.com";
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

  return (
    <>
    <Router>
      <DirectionHandler/>
    <UserProvider>
    <Header/>
    <Routes>

      <Route path="/" element={ <Home/>} />
      <Route path="/:lang" element={ <Home/>} />
      <Route path="/:lang/signup" element={ <SignUp/>} />
      <Route path="/:lang/login" element={ <Login/>} />
      {/* CHALETS ROUTES */}
      <Route path="/:lang/chalets" element={ <Chalets/>} />
      <Route path="/:lang/chaletdetails/:id" element={ <ChaletsDetails/>} />
      <Route path="/:lang/bookingchalet/:id" element={ <BookingChalets/>} />
      <Route path="/:lang/reservechalet/:id" element={ <ReserveChalets/>} />
      <Route path="/:lang/chatbot/:id" element={ <ChatBot/>} />

      <Route path="/:lang/forgetpassword" element={ <ForgetPassword/>} />
      <Route path="/:lang/resetpassword" element={ <ResetPassword/>} />
      {/* EVENTS ROUTES */}
      <Route path="/:lang/events" element={ <Events/>} />
      <Route path="/:lang/eventscategory/:id" element={ <EventsCategory/>} />
      <Route path="/:lang/eventdetails/:id" element={ <EventDetails/>} />
      <Route path="/:lang/reserveevent/:id" element={ <ReserveEvents/>} />
      {/* LANDS ROUTES */}
      <Route path="/:lang/lands" element={ <Lands/>} />
      <Route path="/:lang/landdetails/:id" element={ <LandsDetails/>} />
      <Route path="/:lang/bookingland/:id" element={ <BookingLand/>} />
      {/* PLAYGROUND ROUTES */}
      <Route path="/:lang/playgrounds" element={ <Playgrounds/>} />
      <Route path="/:lang/cashback" element={ <CashBack/>} />

    </Routes>
      </UserProvider>
    <Footer/>
    </Router>

    
    </>
  )
}

export default App
