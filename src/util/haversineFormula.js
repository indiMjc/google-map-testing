const degToRad = deg => {
    return deg * Math.PI / 180
}

export const getDistanceBetween = (lat1, lng1, lat2, lng2) => {
    const earthRadius = 6378137

    const dLat = degToRad(lat2 - lat1)

    const dLong = degToRad(lng2 - lng1)

    const a = Math.sin(dLat / 2)
            * Math.sin(dLat / 2) 
            + Math.cos(degToRad(lat1)) 
            * Math.cos(degToRad(lat1)) 
            * Math.sin(dLong / 2) 
            * Math.sin(dLong / 2)    
            
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    const distanceInMeters = earthRadius * c

    const distanceInMiles = distanceInMeters * 0.0006213712

    const roundedDistance = Math.round(distanceInMiles * 10) / 10

    return roundedDistance
}