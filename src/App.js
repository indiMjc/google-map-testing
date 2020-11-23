import React from "react"
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api"
import { formatRelative } from 'date-fns'

// use-places-autocomplete
// import '@reach/combobox/styles.css'

import mapStyles from './mapStyles'

const libraries = ['places']
// map component wants to fill whatever container it's in and it fills full screen for now.  it's set to view size right now but it might work with %'s to fill a smaller container/window/component
const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
}
// starting position of the map
const center = {
  lat: 43.6532,
  lng: -79.3831
}
const options = {
  styles: mapStyles
}

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCuiZKRpVVnHnLsTZcnp4X2mKslRePrVZU',
    // the reason `libraries` is abstracted away is to prevent unintended re-renders.  best practice is to never use arrays and objects as literals
    libraries
  })


  //handle error and loading states
  if (loadError) return 'Error loading maps'
  if (!isLoaded) return 'Loading maps'

  return (
    <div>
      {
      // `mapContainerStyle`, `center` and `options` are again abstraced away to prevent unwanted re-renders
      }
      <GoogleMap 
        mapContainerStyle={mapContainerStyle} 
        zoom={8} 
        center={center}
        options={options}
      ></GoogleMap>
    </div>
  );
}

export default App;
