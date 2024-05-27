import {Router, Response, Request} from "express";
import {SkinPortService} from "../services/skinPort.service";

export const skinportRoutes = Router({})

const skinPortService = new SkinPortService()

skinportRoutes.get('/items', async (req: Request, res: Response) => {
    const {app_id, currency} = await skinPortService.isAppIdAndCurrency(req)

    try {
        const items = await skinPortService.fetchItems(Number(app_id), String(currency));
        return res.json(items);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
})