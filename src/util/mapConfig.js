import mapStyles from './mapStyles'

export const libraries = ['places']
export const mapContainerStyle = {
    // map component wants to fill whatever container it's in and it fills full screen for now.  it's currently set to view size but it might work with %'s to fill a smaller container/window/component/modal
    width: '100vw',
    height: '100vh'
  }
export const center = {
    // later, we can set the starting position programatically so that the map opens centered on either the user's location (shipping address or pull coordinates from their browser [potential legal implications]) or a selected farm
    lat: 27.994402,
    lng: -81.760254
  }
export const options = {
    // this style config overrides the defauly styling.  get style config files from www.snazzymaps.com
    styles: mapStyles,
    // this disables all of the default controls so we can add back only what we want
    disableDefaultUI: true,
    zoomControl: true
  }