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

const PlacesAutocompleteInput = props => {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions
    } = usePlacesAutocomplete({
      requestOptions: {
        location: {
          lat: () => props.lat,
          lng: () => props.lng
        },
        radius: 100 * 1000
      }
    })

    const handleSelect = async (address) => {
        setValue(address, false)

        clearSuggestions()

        try {
            const results = await getGeocode({ address })
            const { lat, lng } = await getLatLng(results[0])
            props.panTo({ lat, lng })
        } catch (err) {
            console.log('Error', err)
        }
    }

    return (
        <div className='address-search'>
            <Combobox onSelect={handleSelect}>
                <ComboboxInput 
                    value={value}
                    onChange={e => {
                        setValue(e.target.value)
                    }}
                    disabled={!ready}
                    placeholder='Please enter an address'
                />
                <ComboboxPopover>
                    {status === "OK" &&
                        data.map(({ description }) => (
                        <ComboboxOption key={description} value={description} />
                    ))} 
                </ComboboxPopover>
            </Combobox>
        </div>
    )

}

export default PlacesAutocompleteInput

// this component would normally be in a different file
// const Search = props => {
//   // can set options for the auto complete
//   const { 
//     ready, 
//     value, 
//     suggestions: {status, data}, 
//     setValue, 
//     clearSuggestions 
//   } = usePlacesAutocomplete({
//     requestOptions: {
//       location: {
//         // this location setting is looking for a function, so for now they're just simple anonymous functions that return the lat and long of florida
//         lat: () =>  27.994402,
//         lng: () => -81.760254
//       },
//       radius: 100 * 1000
//     }
//   })

//   const handleSelect = async (address) => {
//     // the first argument to the setValue function saves the address returned when user selects a suggestion from auto complete.  the second argument tells the app whether or not to request info from the api again.  since we have the needed data from places autocomplete, this is set to false
//     setValue(address, false);

//     // this clears the suggestions after one is selected
//     clearSuggestions();

//     try {
//       // grabbing some information about the location that user clicks on map with two following functions
//       const results = await getGeocode({ address });
//       console.log('res', results)
//       const { lat, lng } = await getLatLng(results[0]);
//       props.panTo({ lat, lng });
//     } catch (err) {
//       console.log("Error: ", err);
//     }
//   };

//   // using a component library to style search box
//   return <div className='search'>
//     <Combobox onSelect={handleSelect}>
//       <ComboboxInput 
//       // input gets value from auto complete hook above
//         value={value} 
//         // set to state when clicked
//         onChange={e => {
//           setValue(e.target.value)
//         }} 
//         // disable combo box if not ready
//         disabled={!ready}
//         placeholder='Enter an address'
//       />
//       <ComboboxPopover>
//             {status === "OK" &&
//               data.map(({ description }) => (
//                 <ComboboxOption key={description} value={description} />
//               ))}
//         </ComboboxPopover>
//     </Combobox>
//   </div>
// }