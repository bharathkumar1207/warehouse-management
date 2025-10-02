import dotenv from 'dotenv'
dotenv.config()

export async function getCurrentTime():Promise<string>{
    const timeZone = process.env.TIME_ZONE || 'UTC';
    const now = new Date();
    const time:string = now.toLocaleString("en-US", { timeZone: timeZone })

    return time
}
