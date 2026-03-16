import { Link } from "react-router-dom";

export default function Sidebar(){

return(

<div className="w-60 h-screen bg-black text-white p-6">

<h2 className="text-xl mb-8">Horse Club Admin</h2>

<ul className="space-y-4">

<li><Link to="/dashboard">Dashboard</Link></li>

<li><Link to="/bookings">Bookings</Link></li>

<li><Link to="/gallery">Gallery</Link></li>

<li><Link to="/instagram">Instagram</Link></li>

</ul>

</div>

);

}