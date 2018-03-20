$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAjWOkVx7_9m5A5ivUMDg7tPy6jXwPlN-Q",
        authDomain: "train-sched-2.firebaseapp.com",
        databaseURL: "https://train-sched-2.firebaseio.com",
        projectId: "train-sched-2",
        storageBucket: "train-sched-2.appspot.com",
        messagingSenderId: "113591624581"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#submit-btn").on("click", function () {
        event.preventDefault();
        var name = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var firstTime = $("#first-input").val().trim();
        var frequency = $("#freq-input").val().trim();

        database.ref().push({
            name: name,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency,
        });

    });

    database.ref().on("child_added", function (snapshot) {
        var data = snapshot.val();
        var row = $("<tr>");
        var head = $("<th scope='row'</th>");
        head.text(data.name);
        var dest = $("<td>");
        dest.text(data.destination);
        var freq = $("<td>");
        freq.text(data.frequency);

        var next = $("<td>");
        var now = moment();
        var firstArrival = moment(data.firstTime, "HH:mm");
        var nextArrival = calculateNextArrival(firstArrival, now, data.frequency);
        next.text(nextArrival.format("hh:mm A"));

        var wait = $("<td>");
        wait.text(nextArrival.diff(now, "minutes"));

        row.append(head, dest, freq, next, wait);
        $("tbody").append(row);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    function calculateNextArrival(x, y, z) {
        //x = firstArrival; y = now; z = freq

        if (x > y) {
            return x;
        } else {
            var differenceTimes = y.diff(x, "minutes");
            var tRemainder = differenceTimes % parseInt(z);
            var waitInMin = parseInt(z) - tRemainder;
            return y.add(waitInMin, "m");
        }
    };

});