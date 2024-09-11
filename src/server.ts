import app from "./app";
const port = process.env.PORT || 3100;

app.listen(port, () =>{
    console.log(`${port} Server running`)
})