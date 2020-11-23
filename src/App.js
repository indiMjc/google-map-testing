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

import './App.css'

const libraries = ['places']

// this object is how we can set the size of the GoogleMap component
const mapContainerStyle = {
  // map component wants to fill whatever container it's in and it fills full screen for now.  it's currently set to view size but it might work with %'s to fill a smaller container/window/component/modal
  width: '100vw',
  height: '100vh'
}

// this is the starting position of the map
const center = {
  // later, we can set the starting position programatically so that the map opens centered on either the user's location (shipping address or pull coordinates from their browser [potential legal implications]) or a selected farm
  lat: 43.6532,
  lng: -79.3831
}

// this object configures the options for the GoogleMap component
const options = {
  // this style config overrides the defauly styling.  get style config files from www.snazzymaps.com
  styles: mapStyles,
  // this disables all of the default controls so we can add back only what we want
  disableDefaultUI: true,
  zoomControl: true
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
      <h1 className='map-icon'>UFO sightings 🛸</h1>
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
