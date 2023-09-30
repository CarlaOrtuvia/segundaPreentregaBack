import moongoose from "moongoose";

const URI= "mongodb+srv://carlitaortuvia:<password>@cluster0.rvdrpi8.mongodb.net/?retryWrites=true&w=majority" ;

await moongoose.connect(URI,{
    serverSelectionTimeoutMS: 5000,


});

console.log("Base de datos conectada...")
