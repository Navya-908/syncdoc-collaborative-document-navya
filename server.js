const express = require("express");

const app = express();
app.get("/",(req,res) => {
    res.send("SyncDoc backend is running!");
});

app.listen(3000,()=> {
    console.log("SyncDoc server running on http://localhost:3000");
});