$(document).ready(function () {
    $('#sub_button').click(function () {
        console.log("Submit called")
        localStorage.setItem("text", $("#subject").val());
        if ($("#emotion").val() == "other") {
            localStorage.setItem("emotion", $("#other_emo").val());
            localStorage.setItem("other_emo_flag", true)
        } else
            localStorage.setItem("emotion", $("#emotion").val());
        if (!$("#area").val() == "outsider")
            localStorage.setItem("area", $("#other_area").val());
        else
            localStorage.setItem("area", $("#area").val());
        localStorage.setItem("org", $("#org_email").val());
        localStorage.setItem("art", $("#art_email").val());
        window.open('stats.html', '_self')
    });
});

$('#subject').keyup(function () {
    if (this.value.length > 280) {
        return false;
    }
    $("#remainingC").html("Remaining characters: " + (280 - this.value.length));
});

$(document).ready(function () {
    $('#emotion').change(function () {
        var temp_emo = $("#emotion").val();
        if (temp_emo == "other") {
            document.getElementById("other_emo").setAttribute("style",
                "visibility:visible; margin-top:16px");
        }
    });
});

$(document).ready(function () {
    $('#area').change(function () {
        // document.getElementById("liveFeedback").innerHTML = "";
        var temp_area = $("#area").val();
        if (temp_area == "outsider") {
            document.getElementById("other_area").setAttribute("style",
                "visibility:visible; margin-top:16px");
        }
    });
});