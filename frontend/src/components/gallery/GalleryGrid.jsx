import { useEffect,useState } from "react";
import api from "../../services/api";
import React from "react";

export default function GalleryGrid(){

const [images,setImages] = useState([]);

useEffect(()=>{

api.get("/gallery").then(res=>{

setImages(res.data);

});

},[]);

return(

<div className="grid grid-cols-3 gap-4">

{images.map((img)=>(

<img key={img._id} src={img.image_url} className="rounded-lg"/>

))}

</div>

);
}