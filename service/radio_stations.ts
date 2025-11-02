const SEARCH_URL = 'https://de1.api.radio-browser.info/json/stations/search'

export const searchStations = async (searchTerm, countryCode) => {
  const limit = 10
  let url = `${SEARCH_URL}?limit=${limit}&hidebroken=true&order=votes&reverse=true`
  if (searchTerm != undefined && searchTerm != null)
    url += `&name=${searchTerm}`
  if (countryCode != undefined && countryCode != null)
    url += `&countrycode=${countryCode}`
  const resp = await fetch(url)
  if (!resp.ok) return
  const stations = await resp.json()
  if (!stations) return
  return stations
  return []
}
