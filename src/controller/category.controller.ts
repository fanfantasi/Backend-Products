import { Request, Response } from "express";
import prisma from "../services/prisma";
import responseData from "../services/response";
import { ObjectId } from "bson";
var slug = require('slug');
var fs = require('fs');
const { v4: uuidv4 } = require('uuid');

export const categoryController = {
    async find(req: Request, res: Response){
        try{
            let state;
            let totalPage;
            const limit = Number(req.query.limit) || 10;
            const page: number = Number(req.query.page) || 0;
            delete req.query.page;
            delete req.query.limit;
            if (Object.keys(req.query).length !== 0) {
                state = await prisma.category.findMany({
                    where: req.query,
                    select: {
                        id: true,
                        name: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip: (page < 2 ? 0 : page - 1) * limit,
                    take: limit
                });
                totalPage = await prisma.category.count({
                    where: req.query,
                    select: {
                        _all: true,
                    },
                });
            } else {
                state = await prisma.category.findMany({
                    select: {
                        id: true,
                        name: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip: (page < 2 ? 0 : page - 1) * limit,
                    take: limit
                });
                totalPage = await prisma.category.count({
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
            return responseData.resFind(res, 'Categories', state, pagination);
        }catch(err){
            return responseData.resBadRequest(res, 'Faield');
        }
    },

    async findone(req: Request, res: Response){
        try{
            const result = await prisma.category.findFirst({
                where:{
                    id: ObjectId.createFromHexString(req.body?.id).toString()
                },
                select: {
                    id: true,
                    name: true
                },
            })
            return responseData.resFindOne(res, 'Category', result)
        }catch(err){
            console.log(err)
            return responseData.resBadRequest(res, 'Faield');
        }
    }
}

export default categoryController;