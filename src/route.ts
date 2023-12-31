import express from "express";

const router=express.Router()
//создали endpoint
router.get("/", (req,res)=>{
    res.setHeader('Access-Control-Allow-Credentials', "true")
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    res.send("Hi, It's Websocket server!")
})
export default router