import { Request, Response } from "express";
import prisma from "../services/prisma";
import responseData from "../services/response";
import { ObjectId } from "bson";
var slug = require('slug');
var fs = require('fs');
const { v4: uuidv4 } = require('uuid');

export const productController = {
    async find(req: Request, res: Response){
        try{
            let state;
            let totalPage;
            const limit = Number(req.query.limit) || 10;
            const page: number = Number(req.query.page) || 0;
            delete req.query.page;
            delete req.query.limit;
            if (Object.keys(req.query).length !== 0) {
                state = await prisma.product.findMany({
                    where: req.query,
                    select: {
                        id: true,
                        category:{
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        sku: true,
                        name: true,
                        description: true,
                        weight: true,
                        width: true,
                        height: true,
                        length: true,
                        image: true,
                        price: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    orderBy:{
                        updatedAt: 'desc'
                    },
                    skip: (page < 2 ? 0 : page - 1) * limit,
                    take: limit
                });
                totalPage = await prisma.product.count({
                    where: req.query,
                    select: {
                        _all: true,
                    },
                });
            } else {
                state = await prisma.product.findMany({
                    select: {
                        id: true,
                        category:{
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        sku: true,
                        name: true,
                        description: true,
                        weight: true,
                        width: true,
                        height: true,
                        length: true,
                        image: true,
                        price: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    orderBy:{
                        updatedAt: 'desc'
                    },
                    skip: (page < 2 ? 0 : page - 1) * limit,
                    take: limit
                });
                totalPage = await prisma.product.count({
                    select: {
                        _all: true,
                    },
                });
            }
            const pagination = {
                page: page < 2 ? 1 : page,
                limit: limit,
                totalPage: totalPage._all
            };
            return responseData.resFind(res, 'Products', state, pagination);
        }catch(err){
            console.log(err)
            return responseData.resBadRequest(res, 'Faield');
        }
    },

    async findone(req: Request, res: Response){
        try{
            const result = await prisma.product.findFirst({
                where:{
                    id: ObjectId.createFromHexString(req.body?.id).toString()
                },
                select: {
                    id: true,
                    category:{
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    sku: true,
                    name: true,
                    description: true,
                    weight: true,
                    width: true,
                    height: true,
                    length: true,
                    image: true,
                    price: true
                },
            })
            return responseData.resFindOne(res, 'Product', result)
        }catch(err){
            console.log(err)
            return responseData.resBadRequest(res, 'Faield');
        }
    },

    async upsert(req: any, res: Response){
        try{
            const status = await prisma.product.findMany({
                where:{
                    name:{
                        contains: req.body?.name,
                        mode: "insensitive"
                    }
                }
            })
            if (status.length > 0){
                return responseData.resBadRequest(res, `Product name already exists`)
            }else{
                let fileName;
                const dir = './storage/products';
                if (req.files){
                    const file:any = req.files.image;
                    let extension = file.name.split('.').pop().toLowerCase();
                    if (extension == 'jpeg' || extension == 'jpg' || extension == 'png'){
                        if (!fs.existsSync(dir)){
                            await fs.mkdirSync(dir, { recursive: true });
                        }
                        fileName = uuidv4()+'.'+file.name.split('.').pop();
                        await file.mv(dir+'/'+fileName);
                    }else{
                        return responseData.resBadRequest(res, 'Image Extention Required JPEG, JPG OR PNG')
                    }
                }
                const result = await prisma.product.create({
                    data:{
                        categoryid: req.body?.category,
                        sku: req.body?.sku,
                        name: req.body?.name,
                        description: req.body?.description,
                        weight: parseInt(req.body?.weight),
                        width: parseInt(req.body?.width),
                        length: parseInt(req.body?.length),
                        height: parseInt(req.body?.height),
                        price: parseInt(req.body?.price),
                        image: typeof fileName === 'undefined' ? '' : dir.replace('./','')+'/'+fileName,
                    }
                })
                return responseData.resCreatedReturn(res, 'Product', result.id);
            }
        }catch(err){
            console.log(err)
            return responseData.resBadRequest(res, 'Faield');
        }
    },

    async delete(req: Request, res: Response){
        try{
            if (ObjectId.isValid(req.body?.id)) {
                const status = await prisma.product.delete({
                    where:{
                        id:ObjectId.createFromHexString(req.body?.id).toString()
                    }
                })
                
                if (status){
                    return responseData.resDelete(res, 'Product');
                }else{
                    return responseData.resBadRequest(res, 'Product Deleted Unsuccessfully');
                }
            } else {
                return responseData.resBadRequest(res, 'Product Not Valid');
            }
        }catch(err){
            console.log(err)
            return responseData.resBadRequest(res, 'Faield');
        }
    }
}

export default productController;