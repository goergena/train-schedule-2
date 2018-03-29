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
        var firstArrival = moment(data.firstTime, "HH:mm");
        var nextArrival = calculateNextArrival(firstArrival, moment(), data.frequency);
        next.text(nextArrival.format("hh:mm A"));

        var wait = $("<td>");
        wait.text(nextArrival.diff(moment(), 'minutes'));

        row.append(head, dest, freq, next, wait);
        $("tbody").append(row);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    function calculateNextArrival(firstTrain, now, frequency) {

        if (firstTrain > now) {
            return firstTrain;
        } else {
            var differenceTimes = now.diff(firstTrain, "minutes");
            var tRemainder = differenceTimes % parseInt(frequency);
            var waitInMin = parseInt(frequency) - tRemainder;
            return now.add(waitInMin, "m");
        }
    };
