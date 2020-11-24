import React, { useState, useCallback, useRef } from "react"
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api"

import { formatRelative } from 'date-fns'

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox"

// use-places-autocomplete
import '@reach/combobox/styles.css'

import mapStyles from './mapStyles'

import './App.css'

const libraries = ['places']

//!IMPORTANT!  this google maps library is great, but it has issues with unwanted re-renders.  these issues are easy to address.  just avoid using object/arrays as literals and always abstract things like onClick handlers into an outside function

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

const App = () => {
  // array of markers to be rendered on map
  const [ markers, setMarkers ] = useState([])

  // this stores a marker in state to be selected with an onClick callback on the rendered Marker components
  const [ selected, setSelected ] = useState(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // the reason `libraries` is abstracted away is to prevent unintended re-renders.  best practice is to never use arrays and objects as literals
    libraries
  })

  // the onClick function is memoized to prevent unwanted re-renders
  const onMapClick = useCallback(e => {
    setMarkers(current => [ ...current, {
      // this will grab the lat and long of a mouse click on the map as well as mark the time it was clicked
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      time: new Date()
    }])
  }, [])

  // create map reference to access this map elsewhere without forcing a re-render.  this is used for panning the map when a user clicks
  const mapRef = useRef()
  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  // this function allows the map to pan to put a marker in the center of the map if use clicks it
  const panTo = useCallback(({ lat, lng }) => {
    // the panTo function will access the map reference created above and pull data from that instead of accessing the component itself and forcing a re-render
    mapRef.current.panTo({ lat, lng })
    mapRef.current.setZoom(14)
  }, [])

  //handle error and loading states
  if (loadError) return 'Error loading maps'
  if (!isLoaded) return 'Loading maps'

  return (
    <div>
      <h1 className='map-icon'>UFO sightings 🛸</h1>

      {/* Search component made at bottom of this file */}
      <Search panTo={panTo} />

      {/* `mapContainerStyle`, `center`, `onClick` and `options` are again abstraced away to prevent unwanted re-renders */}    
      <GoogleMap 
        mapContainerStyle={mapContainerStyle} 
        zoom={8} 
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >

        {/* the markers are rendered inside the GoogleMap component by mapping over the `markers` array in state.  the position is derived from the coordinates that are pulled in on the onClick function */}      
        {markers.map(marker => <Marker 
                                  key={ marker.lat + marker.lng } 
                                  position={{
                                    lat: marker.lat,
                                    lng: marker.lng
                                  }}
                                  icon={{
                                    // this will override the default marker with custom icon/image
                                    url: '/alien.png',

                                    // resize icon
                                    scaledSize: new window.google.maps.Size(20, 40),

                                    // not sure what origin does 😜 need to check docs
                                    origin: new window.google.maps.Point(0, 0),

                                    // if you set the anchor to half of whatever the `scaledSize` is, it will center the new icon on the mouse click.  otherwise it's off center
                                    anchor: new window.google.maps.Point(10, 20)
                                  }}

                                  // when a user clicks a marker, save that marker to state for use on the InfoWindow component
                                  onClick={() => {
                                    setSelected(marker)
                                  }}
                                />)}

        {/* render an info window if user clicks a map marker.  later, this will have the farm/item info for whatever farm/item a user clicks on */}
        {selected &&  <InfoWindow 
                        position={{ lat: selected.lat, lng: selected.lng }}

                        // when the user closes the info window, set the selected marker back to null by using the onCloseClick prop for the InfoWindow component
                        onCloseClick={() => {setSelected(null)}}
                      >
                          <div>
                            <h2>UFO Spotted!</h2>
                            <p>Spotted {formatRelative(selected.time, new Date())}</p>
                            <p>Later, this will have farm and item data corresponding to the marker that the user clicks</p>
                          </div>
                      </InfoWindow>
        }              
      </GoogleMap>
    </div>
  );
}

export default App;



// this component would normally be in a different file
const Search = props => {
  // can set options for the auto complete
  const { 
    ready, 
    value, 
    suggestions: {status, data}, 
    setValue, 
    clearSuggestions 
  } = usePlacesAutocomplete({
    requestOptions: {
      location: {
        // this location setting is looking for a function, so for now they're just simple anonymous functions that return the lat and long of toronto
        lat: () => 43.6532,
        lng: () => -79.3831
      },
      radius: 100 * 1000
    }
  })

  const handleSelect = async (address) => {
    // the first argument to the setValue function saves the address returned when user selects a suggestion from auto complete.  the second argument tells the app whether or not to request info from the api again.  since we have the needed data from places autocomplete, this is set to false
    setValue(address, false);

    // this clears the suggestions after one is selected
    clearSuggestions();

    try {
      // grabbing some information about the location that user clicks on map with two following functions
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      props.panTo({ lat, lng });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  // using a component library to style search box
  return <div className='search'>
    <Combobox onSelect={handleSelect}>
      <ComboboxInput 
      // input gets value from auto complete hook above
        value={value} 
        // set to state when clicked
        onChange={e => {
          setValue(e.target.value)
        }} 
        // disable combo box if not ready
        disabled={!ready}
        placeholder='Enter an address'
      />
      <ComboboxPopover>
            {status === "OK" &&
              data.map(({ description }) => (
                <ComboboxOption key={description} value={description} />
              ))}
        </ComboboxPopover>
    </Combobox>
  </div>
}