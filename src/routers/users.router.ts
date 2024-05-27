import {Response, Router} from "express";
import {UserService} from "../services/users.service";
import {RequestWithBody} from "../types";
import {settings} from "../settings";
import {DeductBalance} from "../models/users/input.models";

const userService = new UserService()

export const usersRouter = Router({})
// Get users
usersRouter.post('/deduct-balance', async (req:RequestWithBody<DeductBalance>, res:Response) => {
    // const {userId, amount } = req.body;

    const userId = settings.default_userId
    const amount = settings.default_amount

    if (!userId || !amount) {
        return res.status(400).json({ error: 'userId and amount are required' });
    }


    const newBalance = await userService.deductBalance(Number(userId), Number(amount))
    return res.status(200).json({newBalance:newBalance})

})
