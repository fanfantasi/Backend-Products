import { Router } from "express";
import categoryController from "../controller/category.controller";
const routes = Router();


routes.get("/", categoryController.find)
routes.get("/findone", categoryController.findone)

export default routes;