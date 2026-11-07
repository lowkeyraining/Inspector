import { useEffect, useState } from 'react'
import type { InspectionEvent, LiveMessage, StationInfo, StationStatus } from '../types'

function mergeEvents(incoming: InspectionEvent[], prev: InspectionEvent[]) {
  const seen = new Set(prev.map((e) => e.id))
  const fresh = incoming.filter((e) => !seen.has(e.id)).reverse()
  return [...fresh, ...prev].slice(0, 200)
}

export function useLive() {
  const [stations, setStations] = useState<StationInfo[]>([])
  const [statuses, setStatuses] = useState<Record<string, StationStatus>>({})
  const [events, setEvents] = useState<InspectionEvent[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let ws: WebSocket | null = null
    let retryTimer: number | undefined
    let stopped = false

    const loadInitial = () => {
      fetch('/api/stations')
        .then((res) => res.json())
        .then((list: StationInfo[]) => setStations(list))
        .catch(() => {})
      fetch('/api/events')
        .then((res) => res.json())
        .then((history: InspectionEvent[]) => setEvents((prev) => mergeEvents(history, prev)))
        .catch(() => {})
    }

    const connect = () => {
      const proto = location.protocol === 'https:' ? 'wss' : 'ws'
      ws = new WebSocket(`${proto}://${location.host}/ws/live`)

      ws.onopen = () => {
        setConnected(true)
        loadInitial()
      }

      ws.onmessage = (e) => {
        const msg: LiveMessage = JSON.parse(e.data)
        setStatuses(msg.stations)
        if (msg.events.length > 0) {
          setEvents((prev) => mergeEvents(msg.events, prev))
        }
      }

      ws.onclose = () => {
        setConnected(false)
        if (!stopped) retryTimer = window.setTimeout(connect, 2000)
      }
    }

    connect()

    return () => {
      stopped = true
      clearTimeout(retryTimer)
      ws?.close()
    }
  }, [])

  return { stations, statuses, events, connected }
}

export type LiveState = ReturnType<typeof useLive>