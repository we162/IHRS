import { useState } from "react";
import api from "../../services/api";
import React from "react";

export default function BookingForm(){

const [form,setForm] = useState({
name:"",
phone:"",
email:"",
date:"",
start_time:"",
slots:1
});

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit=async(e)=>{
e.preventDefault();

await api.post("/bookings",form);

alert("Booking Successful");
};

return(

<form onSubmit={handleSubmit} className="space-y-4">

<input name="name" placeholder="Name" onChange={handleChange}/>

<input name="phone" placeholder="Phone" onChange={handleChange}/>

<input name="email" placeholder="Email" onChange={handleChange}/>

<input type="date" name="date" onChange={handleChange}/>

<input type="time" name="start_time" onChange={handleChange}/>

<select name="slots" onChange={handleChange}>

<option value="1">1 Slot</option>
<option value="2">2 Slots</option>
<option value="3">3 Slots</option>

</select>

<button className="bg-orange-500 p-3 rounded">

Book Now

</button>

</form>

);
}