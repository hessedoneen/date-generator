var app = new Vue({
  el: '#app',
  data: {
		displayedEvents: [],
		startDate: new Date(),
		endDate: new Date(),
		types: [7,15,11,6,10]
  },
  methods: {
		handleApiCall (response) {
			console.log("api call response:", response.data)
			// this.genres = [...new Set(this.originalSongs.map((song) => song["primaryGenreName"]))]
			this.displayedEvents = response.data.map((activity) => {
				return {
					"Name": activity.event_title,
					"About": activity.description.split("\r")[0],
					"Picture Links": activity.image_url,
					"Address": activity.location_name,
					"Price": this.getPrice(activity.cost),
					"Season": "Any",
					"Inside": false
				}
			})
		},
		getPrice (cost) {
			if (cost.toLowerCase().includes("free") || cost === "") return "free"
			else return "$"
		},
		setDates() {
			this.startDate = new Date()
			this.endDate.setDate(this.startDate.getDate() + 10)
		},
		urlDate (jsDate) {
			console.log(jsDate)
			return `${jsDate.getFullYear()}-${jsDate.getMonth()}-${jsDate.getDate()}`
		},
		urlTypes () {
			return this.types.toString()
		},
		urlRange () {
			return `${this.urlDate(this.startDate)}to${this.urlDate(this.endDate)}`
		},
		url () {
			return `https://events.umich.edu/list/json?filter=types:${this.urlTypes()},&range=${this.urlRange()}&v=2&origin=*`
		},
		search (event) {
			this.setDates()
			console.log("about to axios")
			console.log("THIS IS URL:", this.url())
			axios({
				method: 'get',
				url: this.url(),
				withCredentials: false,
			})
			.then((response) => {
				this.handleApiCall(response)
			})
			.then(() => {})
		}
  },
	created: function() {
		this.search();
	}
})
