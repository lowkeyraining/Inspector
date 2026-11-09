// hook ดึงสถานะกล้องแบบ polling ทุก 1 วินาที

import { useQuery } from '@tanstack/react-query'
import { getHealth } from '../api/inspector'

/** polling /health — ค่า default 1 วินาทีพอสำหรับ FPS กับตาราง detection */
export function useHealth(intervalMs = 1000) {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: intervalMs,
  })
}
