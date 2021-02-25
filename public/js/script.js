console.log("sanityyyyy");

//el = element
new Vue({
    el: "#main",
    data: {
        name: "Morrissey",
        seen: true, //also tried true, then it wont show the v-else in index.html
        images: []
    },
    mounted: function () {
        // console.log("my main vue instance has mounted!");
        // console.log("this.cities", this.cities);
        // console.log("this:", this);
        var self = this;
        axios.get("/images").then(function (response) {
            
            // console.log("this.cities after axios", this.city);
            // console.log("this fter axios: ", this);
            // console.log("response", response.data);
            // console.log("self", self);
            // this.cities = response.data;
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
