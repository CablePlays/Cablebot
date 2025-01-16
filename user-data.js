import { FSDB } from 'file-system-db'
import fs from 'fs'

export function get(userId) {
    return new FSDB(`data/users/${userId}`)
}

export function forEachUser(consumer) {
    for (let file of fs.readdirSync('data/users')) {
        const userId = file.slice(0, -5) // remove ".json"
        const udb = get(userId)
        consumer(userId, udb)
    }
}