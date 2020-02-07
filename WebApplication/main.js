const firebaseConfig = {
    apiKey: "AIzaSyCWYMwnQd7J8jwzfM9YPohPjF_HFlDpeKA",
    authDomain: "rouf-a6674.firebaseapp.com",
    databaseURL: "https://rouf-a6674.firebaseio.com",
    projectId: "rouf-a6674",
    storageBucket: "rouf-a6674.appspot.com",
    messagingSenderId: "835968199171",
    appId: "1:835968199171:web:8e5037a114fb90363c7c36",
    measurementId: "G-Z8WJRBDJ7X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase database reference
const dbRef = firebase.database().ref();
const imagesRef = dbRef.child("images");
var data = imagesRef.on('value', gotData, errData);

function gotData(data) {
    console.log(data.val());
}

function errData(err) {
    console.log("error")
}

const userListUI = document.getElementById("replist");

function logout() {
    firebase.auth().signOut();
}

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 37.796454,
            lng: 26.702993
        },
        zoom: 13
    });


    imagesRef.on('value', function(snapshot) {
        snapshot.forEach(function(child) {
            var childs = child.val();
            var marker = new google.maps.Marker({
                position: {
                    lat: childs.latitude,
                    lng: childs.longtitude
                },
                map: map
            });
        });
    });
}

imagesRef.on("child_added", snap => {
    let image = snap.val();
    let $li = document.createElement("li");
    $li.innerHTML = image.desc;
    $li.setAttribute("child-key", snap.key);
    $li.addEventListener("click", userClicked);
    userListUI.append($li);

});

function userClicked(e) {
    var userID = e.target.getAttribute("child-key");
    const userRef = dbRef.child('reports/' + userID);
    const userDetailUI = document.getElementById("repdetail");
    userDetailUI.innerHTML = ""

    userRef.once("value", snap => {
        let report = snap.child("desc").val();
        var $img = document.createElement("img");
        $img.src = snap.child("url").val();
        var $p = document.createElement("p");
        $p.innerHTML = report;
        userDetailUI.append($p);
        userDetailUI.append($img);
    });
}
