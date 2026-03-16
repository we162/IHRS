import { useState } from "react";
import api from "../services/api";

export default function Gallery(){

const [image,setImage] = useState(null);

const uploadImage = async()=>{

const formData = new FormData();

formData.append("image",image);

await api.post("/gallery",formData);

alert("Uploaded");

};

return(

<div className="p-8">

<h1 className="text-2xl mb-6">Upload Image</h1>

<input type="file" onChange={(e)=>setImage(e.target.files[0])}/>

<button
onClick={uploadImage}
className="bg-orange-500 px-4 py-2 mt-4"
>

Upload

</button>

</div>

);

}