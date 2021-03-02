console.log("sanityyyyy");

Vue.component("first-component", {
    template: "#my-component-template",
    props: ["id"],
    // props: ["images", "imagesTitle", "imagesDescription", "imagesUsername"],
    data: function () {
        return {
            image: {},
            // images: "images",
            // title: "imagesTitle",
            // description: "imagesDescription",
            // username: "imagesUsername"
        };
    },
    mounted: function () {
        var self = this;
        console.log(self);
        axios
            .get("/info/" + self.id)
            .then(function (response) {
                self.image = response.data;
                console.log("response from /info", response.data);
            })
            .catch(function (err) {
                console.log("error in /info helaas", err);
            });
    },
    methods: {
        closeClick: function () {
            this.$emit("close");
            console.log("this emit", this.$emit);
        },
    },

    // props: ["img.id"]
});

//el = element
new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        clickOnImg: null,
    },
    mounted: function () {
        //happens here that when refresh gaat onderaan created at filteren
        var self = this;
        axios
            .get("/images")
            .then(function (response) {
                self.images = response.data;
                // self.images.unshift(response.data);
            })
            .catch(function (err) {
                console.log("error in axios", err);
            });
    },
    methods: {
        handleClick: function () {
            var self = this;
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.usernane);
            formData.append("file", this.file);
            console.log("this.title:", this.title);
            console.log("this.description:", this.description);
            console.log("this.username:", this.username);
            console.log("this.file: ", this.file);

            axios
                .post("/upload", formData)
                .then(function (response) {
                    console.log(
                        "response from post request",
                        response.data.imgToAws
                    );
                    console.log("this.images", self.images);
                    self.images.unshift(response.data.imgToAws);
                })
                .catch(function (err) {
                    console.log("error from post request", err);
                });
        },
        handleChange: function (event) {
            console.log("event.target.files[0] ", event.target.files[0]);
            console.log("handle change is running!");
            this.file = event.target.files[0];
        },
        imageClick: function (id) {
            this.clickOnImg = id.target.id;
            console.log(
                "I just clicked on an image and i hope this works! 🏅 (IT WORKS I DESERVE A MEDAL)",
                id.target.id
            );
        },
        closingModal: function () {
            this.clickOnImg = null;
        },
        //its not closing when clicking on the x

        // closeComponent: function() {
        //     console.log("oh jee it sh");
        // }
    },
});

// this.seen = !this.seen;
