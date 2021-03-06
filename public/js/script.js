(function () {
    //console.log("sanityyyyy");

    Vue.component("second-component", {
        template: "#second-component-template",
        props: ["id"],
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        mounted: function () {
            var self = this;
            // console.log("second component mounted",self);
            axios
                .get("/get-comments/" + this.id)
                .then(function (response) {
                    //console.log("axios get", response);
                    //put in comments
                    self.comments = response.data;
                })
                .catch(function (err) {
                    console.log("error in /get-comments/", err);
                });
        },
        watch: {
            id: function () {
                var self = this;
                axios
                    .get("/get-comments/" + this.id)
                    .then(function (response) {
                   
                        self.comments = response.data;
                    })
                    .catch(function (err) {
                        self.$emit("close");
                        history.pushState({}, "", "/");
                        console.log("error in /get-comments/", err);
                    });
            },
        },
        methods: {
            clickOnSubmitComments: function () {
                var self = this;
                //console.log("clicked on the submit button", this.id);
                var commentFromUser = {
                    comment: this.comment,
                    username: this.username,
                    imgId: this.id,
                };
                axios
                    .post("/commentToDb", commentFromUser)
                    .then(function (response) {
                        // console.log("response from post send comment", response);
                        self.comments.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log(
                            "error from post request submit comment",
                            err
                        );
                    });
            },
        },
    });

    Vue.component("first-component", {
        template: "#first-component-template",
        props: ["id"],
        data: function () {
            return {
                image: {},
                yes: false,
                no: false,
            };
        },
        mounted: function () {
            var self = this;
            //console.log(self);
            axios
                .get("/info/" + this.id)
                .then(function (response) {
                    self.image = response.data;
                    console.log("responoie", response.data.selected);
                    console.log("self image", self.image);
                    self.selected = response.data.selected;

                    if (response.data.selected === "y") {
                        self.yes = true;
                    } else {
                        self.no = true;
                    }
                    // console.log("response from /info", response.data);
                })
                .catch(function (err) {
                    console.log("error in /info helaas", err);
                });
        },
        watch: {
            id: function () {
                console.log("clickOnImg changed, this is the watcher speaking");
                var self = this;
                //console.log(self);
                axios
                    .get("/info/" + this.id)
                    .then(function (response) {
                        if (response.data) {
                            self.image = response.data;
                            console.log("self image voor watch?", self.image);
                        } else {
                            self.$emit("close");
                            location.hash = "";
                            
                        }
                        // console.log("response from /info", response.data);
                    })
                    .catch(function (err) {
                        self.$emit("close");
                        console.log("error in /info helaas", err);
                    });
            },
        },
        methods: {
            closeClick: function () {
                this.$emit("close");
                history.pushState({}, "", "/");
                console.log("clicking the close button");
                // location.hash = "" && id = null;
                // console.log("this emit", this.$emit);
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
            selected: "",
            file: null,
            clickOnImg: location.hash.slice(1),
            button: true
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

            window.addEventListener("hashchange", function () {
                console.log(
                    "hash change has fired!!! something after the has changed!"
                );
                console.log(location.hash);
                self.clickOnImg = location.hash.slice(1);
            });
        },
        methods: {
            handleClick: function () {
                var self = this;
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                formData.append("selected", this.selected);

                console.log("this.selected", this.selected);
                console.log("this.title:", this.title);
                console.log("this.description:", this.description);
                console.log("this.username:", this.username);
                console.log("this.file: ", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (response) {
                       
                        self.images.unshift(response.data.imgToAws);
                    })
                    .catch(function (err) {
                        console.log("error from post request", err);
                    });
            },
            handleChange: function (event) {
                // console.log("event.target.files[0] ", event.target.files[0]);
                // console.log("handle change is running!");
                this.file = event.target.files[0];
            },
            imageClick: function (event) {
                this.clickOnImg = event.target.id;
                // //console.log(
                //     "I just clicked on an image and i hope this works! ???? (IT WORKS I DESERVE A MEDAL)",
                //     event.target.id
                // );
            },
            closingModal: function () {
                this.clickOnImg = null;
            },
            moreButtonClick: function () { 
                var self = this;
                axios.get("/getNextImg/" + this.images[this.images.length -1].id).then(function (response) {
                    console.log("response van axios getnextimg", response);
                    //loopen door array en voor iedere iteratie een image pushen in de images array
                    for (var i = 0; i < response.data.length; i++) {
                        console.log("loopen door array", response.data[i]);
                        //response.data[i].push(self.images);
                        self.images.push(response.data[i]);
                        
                    }
                    if (!response.data[1] ) {
                        self.button = false;
                    }

                }).catch(function (err) {
                    console.log("error in moreButtonClick", err);
                });
                console.log("hello function called");
            },

        },
    });
})();
