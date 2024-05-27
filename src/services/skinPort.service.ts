import NodeCache from 'node-cache';
import {settings} from "../settings";
import {OutputItemsModel} from "../models/skinport/output.models";
import {Request} from "express";

const skinportCache = new NodeCache({ stdTTL: 300 });

export class SkinPortService {

    async fetchItems(app_id:number, currency:string):Promise<OutputItemsModel[]> {
        const cacheKey = `${app_id}-${currency}`;
        const cachedItems = skinportCache.get<OutputItemsModel[]>(cacheKey);

        if (cachedItems) {
            return cachedItems;
        }

        const tradableData:any[] = await this.fetchSkinPort(app_id, currency, true)
        const nonTradableData:any[] = await this.fetchSkinPort(app_id, currency, false)

        const tradableItemsMap = tradableData.reduce((acc, item) => {
            acc[item.market_hash_name] = item;
            return acc;
        }, {});

        const nonTradableItemsMap = nonTradableData.reduce((acc, item) => {
            acc[item.market_hash_name] = item;
            return acc;
        }, {});

        const combinedData = Object.keys(tradableItemsMap).map(market_hash_name => {
            const tradableItem = tradableItemsMap[market_hash_name];
            const nonTradableItem = nonTradableItemsMap[market_hash_name];

            const min_tradable_price = tradableItem.min_price || null;
            const min_untradable_price = nonTradableItem ? (nonTradableItem.min_price || null) : null;

            return {
                market_hash_name,
                currency: tradableItem.currency,
                suggested_price: tradableItem.suggested_price,
                item_page: tradableItem.item_page,
                market_page: tradableItem.market_page,
                min_tradable_price,
                min_untradable_price,
                max_price: tradableItem.max_price,
                mean_price: tradableItem.mean_price,
                median_price: tradableItem.median_price,
                quantity: tradableItem.quantity,
                created_at: tradableItem.created_at,
                updated_at: tradableItem.updated_at
            };
        });

        skinportCache.set(cacheKey, combinedData);

        return combinedData;
    }
    async fetchSkinPort(app_id: number, currency: string, tradable: boolean){
        const response = await fetch(`${settings.skinPort_Api_Url}?app_id=${app_id}&currency=${currency}&tradable=${tradable}`);
        if(response.status !== 200) {
            throw new Error('Failed to fetch SkinPort items.')
        }
        return await response.json();
    }

    async isAppIdAndCurrency(req:Request):Promise<any> {
        let app_id:any
        let currency:any

        if (!req.query.app_id) {
            app_id = settings.default_app_id
        } else {
            app_id = req.query.app_id
        }
        if(!req.query.currency) {
            currency = settings.default_currency
        } else {
            currency = req.query.currency
        }
        return {
            app_id,
            currency
        }
    }
}

