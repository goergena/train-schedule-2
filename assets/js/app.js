$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAeSEQnspIfuu39mrcXEmVWVUeKe2GKcn8",
        authDomain: "train-schedule-1ec1e.firebaseapp.com",
        databaseURL: "https://train-schedule-1ec1e.firebaseio.com",
        projectId: "train-schedule-1ec1e",
        storageBucket: "",
        messagingSenderId: "708784360533"
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

    database.ref().on("child_added", function(snapshot) {
        var data = snapshot.val();
        var row = $("<tr>");
        var head = $("<th scope='row'</th>");
        head.text(data.name);
        var dest = $("<td>");
        dest.text(data.destination);
        var freq = $("<td>");
        freq.text(data.frequency);
        var next = $("<td>");
        var currentTime = calcTime();
        console.log(typeof currentTime);
        var nextArrivalInMin = calculateNextArrival(data.firstTime, data.frequency, currentTime);
        var nextArrivalConverted = timeConverter(nextArrivalInMin);
        console.log(nextArrivalConverted);
        next.text(nextArrivalConverted);
        var wait = $("<td>");
        wait.text(calcWait(nextArrivalInMin, currentTime));
        
        row.append(head, dest, freq, next, wait);
        $("tbody").append(row);
  
      }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    function calcTime() {
        var d = new Date();
        console.log(d.getHours() * 60 + d.getMinutes());
        return d.getHours() * 60 + d.getMinutes();
    }

    function calculateNextArrival(x, y, z) {
        //x will be first train time
        //y will be freq;
        //z will be current Time
        var arr = x.split(":");
        var milHours = parseInt(arr[0]);
        var milMin = parseInt(arr[1]);
        var firstInMin = milHours * 60 + milMin;

        while (firstInMin < z) {
            firstInMin += parseInt(y);
        };
        if (firstInMin >= z) {
            var nextArrival = firstInMin;
            return nextArrival;
        }
    };

    function calcWait(a, b) {
        return a - b;
    }

    function timeConverter(z) {
        //z will be nextArrival
        var convertedHours = Math.floor(z / 60);
        while (convertedHours >= 24) {
            convertedHours -= 24;
        };

        var convertedMinNum = z % 60;
        var convertedMin = convertedMinNum.toString();
        if (convertedMin.length === 1) {
            convertedMin = "0" + convertedMinNum;
        }
        if (convertedHours > 12) {
            convertedHours-=12;
            return convertedHours + ":" + convertedMin + " PM";
        } else if(convertedHours ===0) {
            convertedHours+=12;
            return convertedHours + ":" + convertedMin + " AM";
        } else {
            return convertedHours + ":" + convertedMin + " AM";
        }
    };

});