import { useEffect,useState } from "react";
import api from "../services/api";

export default function Dashboard(){

const [stats,setStats] = useState({});

useEffect(()=>{

api.get("/bookings/stats").then(res=>{
setStats(res.data);
});

},[]);

return(

<div className="p-8">

<h1 className="text-2xl mb-6">Dashboard</h1>

<div className="grid grid-cols-3 gap-6">

<div className="bg-gray-900 p-6 rounded">

<h3>Total Bookings</h3>
<p>{stats.total}</p>

</div>

<div className="bg-gray-900 p-6 rounded">

<h3>Today</h3>
<p>{stats.todayBookings}</p>

</div>

<div className="bg-gray-900 p-6 rounded">

<h3>This Week</h3>
<p>{stats.weeklyBookings}</p>

</div>

</div>

</div>

);

}