import { Prisma } from '@prisma/client'

export function serializeDecimal<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (obj instanceof Prisma.Decimal) {
    return obj.toNumber() as unknown as T
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => serializeDecimal(item)) as unknown as T
  }
  
  if (typeof obj === 'object') {
    // Handle Date objects
    if (obj instanceof Date) {
      return obj as unknown as T
    }
    
    const newObj: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = serializeDecimal((obj as any)[key])
      }
    }
    return newObj as T
  }
  
  return obj
}
