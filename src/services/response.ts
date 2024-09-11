import { Response } from "express";

export const responseData = {
    resCreated(res: Response, name: any) {
        return res.status(201).json({
            error   : null,
            message : `Store ${name} Successfully`
        })
    },
    resCreatedReturn(res: Response, name: any, result:any) {
        return res.status(201).json({
            error   : null,
            message : `Store ${name} Successfully`,
            data: result
        })
    },

    resUpdate(res: Response, name: any) {
        return res.status(201).json({
            error   : null,
            message : `Update ${name} Successfully`
        })
    },
    
    resDelete(res: Response, name: any) {
        return res.status(202).json({
            error   : null,
            message : `Delete ${name} Successfully`
        })
    },

    resFindOne(res: Response, name: any, data: any) {
        return res.status(200).json({
            error       : null,
            message     : `Find ${name} Successfully`,
            data        : data
        })
    },

    resFind(res: Response, name: any, data: any, totalPage: any) {
        return res.status(200).json({
            error       : null,
            message     : `Find ${name} Successfully`,
            data        : data,
            pagination  : totalPage
        })
    },

    resBadRequest(res: Response, message:any){
        return res.status(400).json({
            error   : 'Bad Request',
            message : message,
        })
    },
}

export default responseData;