// create map
const myMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: {},

    makeMap() {
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 15,
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map)

        const marker = L.marker(this.coordinates)
        marker
        .addTo(this.map)
        .bindPopup(`<b>You're here</b>`)//if doesnt run add br and p1 tags
        .openPopup()
    },

    addMarkers() {
        for (var i = 0; i < this.businesses.length; i++) {
            this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long,
            ])
                .bindPopup(`<b>${this.businesses[i].name}</b>`)
                .addTo(this.map)
        }
    },
}



async function acquireCoords() {
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude]
}
console.log()

async function getFoursquare(business) {
    const options = {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        Authorization: 'fsq3LLkqsYvP0rC3v0To47AnNRhnGhttpyF9lZBRajEiGpk='
        }
    }
    let limit = 5
    let lat = myMap.coordinates[0]
    let lom = myMap.coordinates[1]
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
    return businesses
}

function processBusinesses(data) {
    let businesses = data.map((element) => {
        let location = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longitude,
        };
        return location
    })
    return businesses
}

window.onload = async () => {
    const coords = await acquireCoords()
    myMap.coordinates = coords
    myMap.makeMap()
}

document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()
        let business = document.getElementById('business').value
        let data = await getFoursquare(business)
        myMap.businesses = processBusinesses(data)
        myMap.addMarkers()
    
})
