console.log("sanityyyyy");

//el = element
new Vue({
    el: "#main",
    data: {
        // name: "Morrissey",
        // seen: true, //also tried true, then it wont show the v-else in index.html
        images: []
    },
    mounted: function () {
      
        var self = this;
        axios.get("/images").then(function (response) {
            self.images = response.data;
        }).catch(function(err) {
            console.log("error in axios", err);
        });
    },
    methods: {
        handleClick: function (city) {
            console.log("handleClick running :D", city);
            this.seen = !this.seen;
        }
    }
});
