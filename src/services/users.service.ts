import {queryDatabase} from '../db/db';
import {pool} from "../settings";

export class UserService {
    async getUserBalance(userId: number):Promise<number> {
        const result: any = await queryDatabase('SELECT balance FROM users WHERE id = $1 FOR UPDATE', [userId]);
        if (result.length === 0) {
            throw new Error('User not found');
        }
        return result[0].balance;
    }

    async updateUserBalance(userId: number, newBalance: number):Promise<void> {
        await queryDatabase('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);
    }

    async deductBalance(userId: number, amount: number):Promise<number> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const currentBalance = await this.getUserBalance(userId);

            if (currentBalance < amount) {
                throw new Error('Insufficient balance');
            }

            const newBalance = currentBalance - amount;
            await this.updateUserBalance(userId, newBalance);

            await client.query('COMMIT');

            return newBalance;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}
