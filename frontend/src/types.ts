export interface Detection {
  class: string
  confidence: number
  bbox: [number, number, number, number]
}

export interface StationInfo {
  id: string
  name: string
  source: number | string
}

export interface StationStatus {
  camera_ok: boolean
  fps: number
  detections: Detection[]
}

export interface InspectionEvent {
  id: number
  station_id: string
  timestamp: number
  class: string
  confidence: number
}

export interface LiveMessage {
  type: 'status'
  stations: Record<string, StationStatus>
  events: InspectionEvent[]
}