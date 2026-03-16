import { useState } from "react";
import api from "../services/api";

export default function Instagram(){

const [url,setUrl] = useState("");

const addPost = async()=>{

await api.post("/instagram",{url});

alert("Post added");

};

return(

<div className="p-8">

<h1 className="text-2xl mb-6">Add Instagram Post</h1>

<input
placeholder="Instagram URL"
onChange={(e)=>setUrl(e.target.value)}
/>

<button
onClick={addPost}
className="bg-orange-500 px-4 py-2 ml-2"
>

Add

</button>

</div>

);

}