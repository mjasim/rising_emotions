// // Used to toggle the menu on small screens when clicking on the menu button
// function myFunction() {
//     var x = document.getElementById("navDemo");
//     if (x.className.indexOf("w3-show") == -1) {
//         x.className += " w3-show";
//     } else {
//         x.className = x.className.replace(" w3-show", "");
//     }
// }

// d3.json("stats.json", function (err, myjson) {
//     console.log(myjson)
//     raw_json = JSON.parse(JSON.stringify(myjson))
//     stat = JSON.parse(JSON.stringify(myjson))

//     save_stat(stat)
// })

stat = null;
raw_json = null;

dict = {
    "text": localStorage.getItem("text"),
    "emotion": localStorage.getItem("emotion"),
    "area": localStorage.getItem("area"),
    "org": localStorage.getItem("org"),
    "art": localStorage.getItem("art")
}

d3.json("stats.json", function (err, myjson) {
    // console.log(myjson)
    raw_json = JSON.parse(JSON.stringify(myjson))
    stat = JSON.parse(JSON.stringify(myjson))

    if (localStorage.getItem("emotion") === null) {
        draw_bars(stat);
    } else {
        makeRevision(JSON.parse(JSON.stringify(stat)))
        draw_bars(stat);
    }

    localStorage.clear();
})

d3.json("info.json", function (err, infojson) {
    // console.log(infojson);
    infojson.push(dict)
    console.log(infojson);
    var save_info = JSON.stringify(infojson);

    request = new XMLHttpRequest();
    request.open("POST", "save_info.php");
    request.setRequestHeader("Content-type", "application/json");
    request.send(save_info);
})

function inc_idx_emo(temp_stat, emo) {

    if (localStorage.getItem("other_emo_flag")) {
        // console.log(temp_stat[5])
        temp_stat[5]["count"] = parseInt(temp_stat[5]["count"]) + 1;
        // console.log(temp_stat[5])
        return;
    }

    for (var i = 0; i < temp_stat.length; i++) {
        if (temp_stat[i]["emotion"].toLowerCase() == emo) {
            temp_stat[i]["count"] = parseInt(temp_stat[i]["count"]) + 1;
        }
    }
}

function makeRevision(temp_stat) {

    console.log("before", JSON.stringify(temp_stat))
    //write update//
    inc_idx_emo(temp_stat, localStorage.getItem("emotion"));

    // console.log('make revision');
    var save_data = JSON.stringify(temp_stat);
    // console.log("after", save_data)

    request = new XMLHttpRequest();
    request.open("POST", "save_file.php");
    request.setRequestHeader("Content-type", "application/json");
    request.send(save_data);

    stat = temp_stat;
}

function draw_bars(data) {

    var color = ["#FDFD12", "#59CBE6", "#2C3393", "#F05CA6", "#B3E534"];

    // set the dimensions and margins of the graph
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 600 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#stat-chart").append("svg")
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 600 200`)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function (d) {
        d.count = +d.count;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) {
        return d.emotion;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.count;
    })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.emotion);
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            return y(d.count);
        })
        .attr("height", function (d) {
            return height - y(d.count);
        })
        .style("fill", function (d, i) {
            console.log(color[i])
            return color[i];
        });

svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function (d) {
        return d.count;
    })
    .attr("x", function (d) {
        return x(d.emotion) + x.bandwidth() / 2 - 10;
    })
    .attr("y", function (d) {
        return y(d.count) - 5;
    })

// add the x Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("style", "font-family: \"Lato\", sans-serif; font-size: 10px");
}