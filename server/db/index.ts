import mysql from 'mysql2/promise';

interface IOptions {
    query: string,
    values?: any[]
}
// данные от базы данных
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wather'
});

export const sql = async ({ query, values }: IOptions) => {
    const [rows] = await pool.query(query, values)
    return rows
}


