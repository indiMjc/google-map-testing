import { useCallback } from 'react'

// this function allows the map to pan to put a marker in the center of the map if use clicks it
export const panTo = useCallback(({ lat, lng }, mapRef) => {
    // the panTo function will access the map reference created above and pull data from that instead of accessing the component itself and forcing a re-render
    mapRef.current.panTo({ lat, lng })
    mapRef.current.setZoom(14)
  }, [])