import { BrowserRouter,Routes,Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Bookings from "../pages/Bookings";
import Gallery from "../pages/Gallery";
import Instagram from "../pages/Instagram";

export default function AdminRoutes(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>}/>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/bookings" element={<Bookings/>}/>

<Route path="/gallery" element={<Gallery/>}/>

<Route path="/instagram" element={<Instagram/>}/>

</Routes>

</BrowserRouter>

);

}