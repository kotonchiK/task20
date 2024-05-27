import {pool} from '../settings';

// Функция для выполнения запроса к базе данных
export const queryDatabase = async (queryText: string, params: any[]) => {
    const client = await pool.connect();
    try {
        const res = await client.query(queryText, params);
        return res.rows;
    } finally {
        client.release();
    }
};
