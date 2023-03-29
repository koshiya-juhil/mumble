import Welcome from "./view/Welcome"
import './style.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./view/Login"
import NavigationBar from "./components/NavigationBar"
import Signup from "./view/Signup"
import "react-toastify/dist/ReactToastify.css"
import Home from "./view/Home"
import SetAvatar from "./view/SetAvatar"
import MumbleAI from "./view/MumbleAI"

function App() {
  return (
    <>
      <Router>
        {/* <NavigationBar /> */}
        <Routes>
          <Route exact path="/" element={<Welcome />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/setavatar" element={<SetAvatar />} />
          <Route eaxct path="/mumbleai" element={<MumbleAI />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
