/** type ตรงกับ JSON ที่ backend ส่งมา (ดู backend/app/camera.py: get_status) */

export type Detection = {
  class: string
  confidence: number
  bbox: [number, number, number, number]
}

export type Health = {
  source: number | string
  fps: number
  detections: Detection[]
}
