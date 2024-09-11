import { Router } from "express";
import productController from "../controller/product.controller";
const routes = Router();


routes.get("/", productController.find)
routes.post("/findone", productController.findone)
routes.post("/", productController.upsert)
routes.delete("/", productController.delete)

export default routes;