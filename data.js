import { FSDB } from 'file-system-db'

export function getDatabase() {
    return new FSDB(`data/data`)
}