import express from "express";
const fileUpload = require('express-fileupload');
const rt = require('quickthumb');
var bodyParser = require('body-parser');
import { productRotues, categoryRoutes } from "./routes";

const path = __dirname;

class App {
    public server;

    constructor() {
        this.server = express()

        this.middlewares();
        this.routes();
    }
    

    middlewares(){
        this.server.use(express.json());
    }

    routes(){
        const cors=require("cors");
        this.server.use(cors());
        //Body Parser
        this.server.use(bodyParser.urlencoded({
            extended: true
        }));
        this.server.use(bodyParser.json({
            limit: "16mb",
        }));
        this.server.use(function (req, res, next) {
            next();
        });

        this.server.use(express.static(path));
        
        this.server.get('/', function (req, res) {
            res.sendFile(path + "/index.html");
        });
          
        this.server.use(fileUpload(
            {useTempFiles : true,
            tempFileDir : '/tmp/'}
        ));
        this.server.use('/storage', rt.static(process.cwd() + '/storage'));
        this.server.use('/storage', express.static(process.cwd() + '/storage'));
        this.server.use('/v1/product', productRotues);
        this.server.use('/v1/category', categoryRoutes);
    }
}

export default new App().server;