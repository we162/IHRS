import { useEffect,useState } from "react";
import api from "../../services/api";
import React from "react";

export default function InstagramFeed(){

const [posts,setPosts] = useState([]);

useEffect(()=>{

api.get("/instagram").then(res=>{

setPosts(res.data);

});

},[]);

return(

<div className="grid grid-cols-3 gap-4">

{posts.map((post)=>(
<a href={post.url} target="_blank">
View Post
</a>
))}

</div>

);
}