import { app } from './index.ts'
import os from 'os'

const PORT :number = Number(process.env.SERVER_PORT)

const getLocalIP = (): string => {
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }

    for(const interfaceName of Object.keys(interfaces)){
        for(const iface of interfaces[interfaceName]||[]){
            return iface.address
        }
    }

    return '127.0.0.1'
}
const localIP = getLocalIP()

app.listen(PORT,"0.0.0.0",() =>{
    console.log(`Servere is running: `)
    console.log(`Local access  : http://localhost:${PORT}/`)
    console.log(`Wi-fi access  : http://${localIP}:${PORT}/`)
})