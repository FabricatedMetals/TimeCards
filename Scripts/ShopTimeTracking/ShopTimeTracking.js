var pageModel;

function payrollPageLoad(model) {
    pageModel = JSON.parse(model);
    document.getElementsByTagName('body')[0].onload = "";


    var video = document.querySelector("#videoElement");

    var errorCallback = function (e) {
        console.log('Reeeejected!', e);
    };

    var successCallback = function (localMediaStream) {
        var video = document.querySelector("#videoElement");
        video.src = window.URL.createObjectURL(localMediaStream);
    }

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    //if (navigator.getUserMedia) {
    //    navigator.getUserMedia({ video: true }, handleVideo, videoError);
    //}

    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            video: true,
            
            mandatory: {
            minWidth: 400,
            minHeight: 400
        }
        }, successCallback, errorCallback);
    } else {
        console.log('Native device media streaming (getUserMedia) not supported in this browser.');
        // Display a friendly "sorry" message to the user.
    }
}

function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    alert(e);
    // do something
}

function snapshot() {
    var video = document.querySelector("#videoElement");
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    // set the canvas to the dimensions of the video
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    ctx.drawImage(video, 0, 0);
   


    return canvas.toDataURL('image/png').substring(canvas.toDataURL('image/png').indexOf(',') + 1);;

}

function jobTimePageLoad(model) {
    pageModel = JSON.parse(model);
    pageModel.currentJobtimeRow = 1;
    

    document.getElementsByTagName('body')[0].onload = "";

    $('input[type=radio][name=locations]').change(function () {
        var location = $('input[name=locations]:checked').val()
        if (location != undefined) {
            var i = 0;
            var departmentListHTML;
            while ($('#departmentBox_' + i).length > 0) {
                $('#departmentBox_' + i).html('');
                departmentListHTML = "<select id = \"departmentBox_" + i + "\">"
                for (var j = 0; j < pageModel.departments.length; j++) {
                    if (pageModel.departments[j].locationName == location)
                        departmentListHTML += "<option value = " + pageModel.departments[j].departmentID + ">" + pageModel.departments[j].departmentNumber + "- " + pageModel.departments[j].departmentName + "</option>";
                }
                departmentListHTML += "</select>";
                $('#departmentBox_' + i).html(departmentListHTML);
                i++;
            }
        }
    });
    
    pageModel.jobTimeRowsHTML = $('#jobTimesListDiv').html()

}

function editEmployeePageLoad(model) {
    pageModel = JSON.parse(model);
    //document.getElementsByTagName('body')[0].onload = "";grrrrrrrrr

    $('#shiftBoxDiv').html('');

    var shiftListHTML = "<select id = \"shiftBox\" '>";
    for (var i = 0; i < pageModel.shifts.length; i++) { 
        shiftListHTML += "<option value = " + pageModel.shifts[i].shiftId + ">" + pageModel.shifts[i].shiftName + "</option>";
    }
    shiftListHTML += "</select>";
    $('#shiftNameBox').val('New Shift Name');

    $('#shiftBoxDiv').html(shiftListHTML);


}

function overtimePageLoad(model) {
    pageModel = JSON.parse(model);
    pageModel.currentOvertimeRow = 1;
    
    pageModel.overTimeRowsHTML = $('#overTimeRowsDiv').html()
    calendarInitialize(0);
    document.getElementsByTagName('body')[0].onload = "";

    $('#overtimeBoxDiv').html('');
    $('#deleteSubmit').hide();

    var overtimeListHTML = "<select id = \"overtimeBox\" onchange='updateOvertime();'> <option value = \"\" >Add new overtime</option>";
    for (var i = 0; i < pageModel.overtimes.length; i++) {
        var startTime = new Date(parseInt(pageModel.overtimes[i].startTime.substr(6)));
        var endTime = new Date(parseInt(pageModel.overtimes[i].endTime.substr(6)));

        startTime.toDateString()

        overtimeListHTML += "<option value = " + pageModel.overtimes[i].overtimeID + ">" + pageModel.overtimes[i].employeeName + "-" + startTime.toDateString() + "</option>";
    }
    overtimeListHTML += "</select>";
    $('#overtimeBoxDiv').html(overtimeListHTML);

}

function timeOffPageLoad(model) {
    pageModel = JSON.parse(model);
    document.getElementsByTagName('body')[0].onload = "";

    $('#overtimeBoxDiv').html('');

    var timeOffListHTML = "<select id = \"overtimeBox\" onchange='updateTimeOff();'> <option value = \"\" >Add new time off</option>";
    for (var i = 0; i < pageModel.overtimes.length; i++) {
        var startTime = new Date(parseInt(pageModel.overtimes[i].startTime.substr(6)));
        var endTime = new Date(parseInt(pageModel.overtimes[i].endTime.substr(6)));

        startTime.toDateString()

        timeOffListHTML += "<option value = " + pageModel.overtimes[i].overtimeID + ">" + pageModel.overtimes[i].employeeName + "-" + startTime.toDateString() + "</option>";
    }
    timeOffListHTML += "</select>";
    $('#overtimeBoxDiv').html(timeOffListHTML);

}

function editShiftsPageLoad(model) {
    pageModel = JSON.parse(model);
    document.getElementsByTagName('body')[0].onload = "";
    pageModel.newShiftCount = 0;

    $('#shiftBoxDiv').html('');

    var shiftListHTML = "<select id = \"shiftBox\" onchange='getShiftInformation();'> <option value = \"\" >Add new shift</option>";
    for (var i = 0; i < pageModel.shifts.length; i++) {
        shiftListHTML += "<option value = " + pageModel.shifts[i].shiftId + ">" + pageModel.shifts[i].shiftName + "</option>";
    }
    shiftListHTML += "</select>";
    $('#shiftNameBox').val('New Shift Name');

    $('#shiftBoxDiv').html(shiftListHTML);
}

function editPayrollPageLoad(model) {
    pageModel = JSON.parse(model);
    document.getElementsByTagName('body')[0].onload = "";
    pageModel.newShiftCount = 0;
}

function getPunchInformation() {
    
    var id = $('#employeeBox').val();

    if ($('#shiftBox').val() == '') {
        $('#shiftPeriodsDiv').html('');
        $('#shiftNameBox').val('New Shift Name');
        return;
    }

    $.ajax({
        data: { shiftID: $('select[id=shiftBox]').val() },
        url: "GetShiftInformation",
        async: false,
        success: function (data) {

            //Populate Name
            $('#shiftNameBox').val(data.shiftName);

            $('#shiftPeriodsDiv').html('');

            var shiftPeriodsHtml = '';

            for (var i = 0; i < data.shifts.length; i++) {
                shiftPeriodsHtml += shiftPeriodsHtmlString(data.shifts[i].shiftPeriodID);
            }

            $('#shiftPeriodsDiv').html(shiftPeriodsHtml);

            for (var i = 0; i < data.shifts.length; i++) {
                var node = data.shifts[i];
                $('#startDays_' + node.shiftPeriodID).val(node.startDate);
                var startTime = new Date(parseInt(node.startTime.substr(6)));
                $('#startTimeHours_' + node.shiftPeriodID).val(startTime.getHours() % 12);
                $('#startTimeQuarterHours_' + node.shiftPeriodID).val(startTime.getMinutes());
                $('#startTimeAMPM_' + node.shiftPeriodID).val((startTime.getHours() >= 12 ? "PM" : "AM"));
                var endTime = new Date(parseInt(node.endTime.substr(6)));
                $('#endTimeHours_' + node.shiftPeriodID).val(endTime.getHours() % 12);
                $('#endTimeQuarterHours_' + node.shiftPeriodID).val(endTime.getMinutes());
                $('#endTimeAMPM_' + node.shiftPeriodID).val((endTime.getHours() >= 12 ? "PM" : "AM"));
            }

        }
    });
}

function shiftPeriodsHtmlString(shiftPeriodID) {
    return "<div class = \"shiftPeriods\" id='div_" + shiftPeriodID + "'><select  class = \"shiftSelect\" id=\"startDays_" + shiftPeriodID + "\">"
                + "<option value=\"Sunday\">Sunday</option>"
                + "<option value=\"Monday\">Monday</option>"
                + "<option value=\"Tuesday\">Tuesday</option>"
                + "<option value=\"Wednesday\">Wednesday</option>"
                + "<option value=\"Thursday\">Thursday</option>"
                + "<option value=\"Friday\">Friday</option>"
                + "<option value=\"Saturday\">Saturday</option>"
                + "</select>"
                + "<label for = \"startTimeHours_" + shiftPeriodID + "\">Start: </label><select style=\"width: 60px;\" id=\"startTimeHours_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                + "<option value=0>12</option>"
                + "<option value=1>1</option>"
                + "<option value=2>2</option>"
                + "<option value=3>3</option>"
                + "<option value=4>4</option>"
                + "<option value=5>5</option>"
                + "<option value=6>6</option>"
                + "<option value=7>7</option>"
                + "<option value=8>8</option>"
                + "<option value=9>9</option>"
                + "<option value=10>10</option>"
                + "<option value=11>11</option>"
                + "</select>"
                + "<select style=\"width: 60px;\" id=\"startTimeQuarterHours_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                + "<option value=0>0</option>"
                + "<option value=15>15</option>"
                + "<option value=30>30</option>"
                + "<option value=45>45</option>"
                + "</select>"
                + "<select style=\"width: 60px;\" id=\"startTimeAMPM_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                + "<option value='AM'>AM</option>"
                + "<option value='PM'>PM</option>"
                + "</select>"
                + "<label for = \"startTimeHours_" + shiftPeriodID + "\">End: </label><select style=\"width: 60px;\" id=\"endTimeHours_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                + "<option value=0>12</option>"
                + "<option value=1>1</option>"
                + "<option value=2>2</option>"
                + "<option value=3>3</option>"
                + "<option value=4>4</option>"
                + "<option value=5>5</option>"
                + "<option value=6>6</option>"
                + "<option value=7>7</option>"
                + "<option value=8>8</option>"
                + "<option value=9>9</option>"
                + "<option value=10>10</option>"
                + "<option value=11>11</option>"
                + "</select>"
                + "<select id=\"endTimeQuarterHours_" + shiftPeriodID + "\" style=\"width: 60px;\" class = \"shiftSelect\">"
                + "<option value=0>0</option>"
                + "<option value=15>15</option>"
                + "<option value=30>30</option>"
                + "<option value=45>45</option>"
                + "</select>"
                + "<select id=\"endTimeAMPM_" + shiftPeriodID + "\" style=\"width: 60px;\" class = \"shiftSelect\">"
                + "<option value='AM'>AM</option>"
                + "<option value='PM'>PM</option>"
                + "</select>"
                + "<input type='submit' value='Remove' onclick='removeWorkPeriod(" + shiftPeriodID + ");' /><br /></div>";

}

function payrollHtmlString(shiftPeriodID) {
    return "<div class = \"shiftPeriods\" id='div_" + shiftPeriodID + "'>"

        //ADD CHECKBOX AT BOTTOM

        //then
      
                + "<label for = \"punchType_" + shiftPeriodID + "\">Punch Type: </label><select id=\"punchType_" + shiftPeriodID + "\" class = \"shiftSelect\">"
            //Loop through punch types.
                + "</select>"
                + "<label for = \"location_" + shiftPeriodID + "\">Location: </label><select id=\"location_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                //Loop through locations.
                + "</select>"
                + "<label for = \"startTimeHours_" + shiftPeriodID + "\">Start: </label><select id=\"startTimeHours_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                + "<option value=0>12</option>"
                + "<option value=1>1</option>"
                + "<option value=2>2</option>"
                + "<option value=3>3</option>"
                + "<option value=4>4</option>"
                + "<option value=5>5</option>"
                + "<option value=6>6</option>"
                + "<option value=7>7</option>"
                + "<option value=8>8</option>"
                + "<option value=9>9</option>"
                + "<option value=10>10</option>"
                + "<option value=11>11</option>"
                + "</select>"
                + "<select id=\"startTimeQuarterHours_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                + "<option value=0>0</option>"
                + "<option value=15>15</option>"
                + "<option value=30>30</option>"
                + "<option value=45>45</option>"
                + "</select>"
                + "<select id=\"startTimeAMPM_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                + "<option value='AM'>AM</option>"
                + "<option value='PM'>PM</option>"
                + "</select>"
                + "<label for = \"startTimeHours_" + shiftPeriodID + "\">End: </label><select id=\"endTimeHours_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                + "<option value=0>12</option>"
                + "<option value=1>1</option>"
                + "<option value=2>2</option>"
                + "<option value=3>3</option>"
                + "<option value=4>4</option>"
                + "<option value=5>5</option>"
                + "<option value=6>6</option>"
                + "<option value=7>7</option>"
                + "<option value=8>8</option>"
                + "<option value=9>9</option>"
                + "<option value=10>10</option>"
                + "<option value=11>11</option>"
                + "</select>"
                + "<select id=\"endTimeQuarterHours_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                + "<option value=0>0</option>"
                + "<option value=15>15</option>"
                + "<option value=30>30</option>"
                + "<option value=45>45</option>"
                + "</select>"
                + "<select id=\"endTimeAMPM_" + shiftPeriodID + "\" class = \"shiftSelect\">"
                + "<option value='AM'>AM</option>"
                + "<option value='PM'>PM</option>"
                + "</select>"
                + "<input type='submit' value='Remove' onclick='removeWorkPeriod(" + shiftPeriodID + ");' /><br /></div>";

}

function removeWorkPeriod(shiftPeriodID) {
    $('#div_' + shiftPeriodID).remove();
}




function getShiftInformation() {
    if ($('#shiftBox').val() == '') {
        $('#shiftPeriodsDiv').html('');
        $('#shiftNameBox').val('New Shift Name');
        return;
    }

    var shiftID = $('select[id=shiftBox]').val();

    $.ajax({
        data: { shiftID: shiftID },
        url: "GetShiftInformation",
        async: false,
        success: function (data) {

            //Populate Name
            $('#shiftNameBox').val(data.shiftName);

            $('#shiftPeriodsDiv').html('');

            var shiftPeriodsHtml = '';

            if (data.shifts != undefined)
            {

                for (var i = 0; i < data.shifts.length; i++) {
                    shiftPeriodsHtml += shiftPeriodsHtmlString(data.shifts[i].shiftPeriodID);
                }

                $('#shiftPeriodsDiv').html(shiftPeriodsHtml);

                for (var i = 0; i < data.shifts.length; i++) {
                    var node = data.shifts[i];
                    $('#startDays_' + node.shiftPeriodID).val(node.startDate);
                    var startTime = new Date(parseInt(node.startTime.substr(6)));
                    $('#startTimeHours_' + node.shiftPeriodID).val(startTime.getHours() % 12);
                    $('#startTimeQuarterHours_' + node.shiftPeriodID).val(startTime.getMinutes());
                    $('#startTimeAMPM_' + node.shiftPeriodID).val((startTime.getHours() >= 12 ? "PM" : "AM"));
                    var endTime = new Date(parseInt(node.endTime.substr(6)));
                    $('#endTimeHours_' + node.shiftPeriodID).val(endTime.getHours() % 12);
                    $('#endTimeQuarterHours_' + node.shiftPeriodID).val(endTime.getMinutes());
                    $('#endTimeAMPM_' + node.shiftPeriodID).val((endTime.getHours() >= 12 ? "PM" : "AM"));
                }
            }

            $('#employeeShiftsDiv').hide();
            $('#employeeShiftsDiv').html('');

            if (data.employeeShifts.length > 0) {
                //show all these employees
                $('#employeeShiftsDiv').show();
                $('#employeeShiftsDiv').css('display', 'table');
                var employeeShiftsDivHTML = "";

                employeeShiftsDivHTML += "<div>";

                //loop
                for (var i = 0; i < data.employeeShifts.length; i++) {

                    employeeShiftsDivHTML += "<label for = \"employeeShift_" + data.employeeShifts[i][0] + "\">" + data.employeeShifts[i][1] + ": </label><select id=\"employeeShift_" + data.employeeShifts[i][0] + "\" class = \"shiftSelect\">"
                    //loop through shifts as options, select current. "<option value=9>9</option>"
                    //document.getElementsByTagName('body')[0].onload = "";grrrrrrrrr

                    for (var j = 0; j < pageModel.shifts.length; j++) {
                        employeeShiftsDivHTML += "<option value = " + pageModel.shifts[j].shiftId + " ";
                        if (pageModel.shifts[j].shiftId == shiftID)
                            employeeShiftsDivHTML += "selected"
                        employeeShiftsDivHTML += ">" + pageModel.shifts[j].shiftName + "</option>";
                    }
                    employeeShiftsDivHTML += "</select><br /><br /><br />";
                    employeeShiftsDivHTML += "</div>";
                }

                $('#employeeShiftsDiv').html(employeeShiftsDivHTML);
                //$("#shiftBox").val(data.workPeriodID);

            }
        }
    });
}

function getPayrollInformation() {
    
    var punchDate = $('#selectDate').val();
    var employeeId = $('#employeeBox').val();

    if (checkID() && punchDate != undefined) {

        $.ajax({
            data: { employeeID: employeeId, punchDate: punchDate },
            url: "GetPunchInformation",
            async: false,
            success: function (data) {

                //Populate Name
                $('#shiftPeriodsDiv').html('');

                var shiftPeriodsHtml = '';

                for (var i = 0; i < data.length; i++) {
                    shiftPeriodsHtml += payrollHtmlString(data[i].shiftPeriodID);
                }

                $('#shiftPeriodsDiv').html(shiftPeriodsHtml);

                for (var i = 0; i < data.length; i++) {
                    var node = data[i];

                    $('#Location_' + node.shiftPeriodID).val(node.Location);
                    $('#PunchType_' + node.shiftPeriodID).val(node.PunchType);
                    var startTime = new Date(parseInt(node.startTime.substr(6)));
                    $('#startTimeHours_' + node.shiftPeriodID).val(startTime.getHours() % 12);
                    $('#startTimeQuarterHours_' + node.shiftPeriodID).val(startTime.getMinutes());
                    $('#startTimeAMPM_' + node.shiftPeriodID).val((startTime.getHours() >= 12 ? "PM" : "AM"));
                    
                }
            }
        });
    }
    else {
        alert("Invalid Input");
    }
}

function addPunch() {
    var punchHtml = payrollHtmlString(pageModel.newShiftCount--);


    $('#punchessDiv').html($('#punchessDiv').html() + shiftPeriodsHtml);
    //$('#shiftPeriodsDiv').append();
}

function addShiftPeriod() {
    var shiftPeriodsHtml = shiftPeriodsHtmlString(pageModel.newShiftCount--);
    

    //$('#shiftPeriodsDiv').html($('#shiftPeriodsDiv').html() + shiftPeriodsHtml);
    $('#shiftPeriodsDiv').append(shiftPeriodsHtml);
}

function checkID() {
    var id = $('#employeeBox').val();

    id = id.replace(/ /g,'');
    $('#employeeBox').val(id);

    var flag = false;

    if (id.split(',').length > 1 && (document.getElementById("overtimeBoxDiv") != null || document.getElementById("shiftNameBox")))
    {
        var idList = id.split(',');
        for (j = 0; j < idList.length; j++)
        {
            flag = false;
            for (i = 0; i < pageModel.employees.length; i++) {
                if (idList[j] == pageModel.employees[i].employeeId) {
                    $('#employeeName').append(pageModel.employees[i].name);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                $('#employeeName').html('Error in list.')
                return false;
            }
        }
        return true;
    }
    else
    {
        for (i = 0; i < pageModel.employees.length; i++) {
            if (id == pageModel.employees[i].employeeId) {
                $('#employeeName').html(pageModel.employees[i].employeeName)
                //checkWorkLeaderID();
                return true;
            }
        }
        $('#employeeBox').val('');
        $('#employeeName').html('Employee ID Not Found');
        return false;
    }

    
}

function checkWorkLeaderID() {
    var id = parseInt($('#workleaderBox').val());

    for (i = 0; i < pageModel.employees.length; i++) {

        if ((id == pageModel.employees[i].employeeId) && pageModel.employees[i].workleaderFlag) {
            $('#workleaderName').html(pageModel.employees[i].employeeName)
            return true;
        }
    }
    $('#workleaderName').html('Work Leader ID Not Found');
    return false;
}

function getEmployeeInfo() {
    if (!checkID())
        return false;
    $.ajax({
        data: { employeeID: $('#employeeBox').val() },
        url: "GetEmployeeInformation",
        async: false,
        success: function (data) {
            $('#employeeName').val(data.employeeName);
            $('#employeeBox').val(data.employeeId);
            $('#workLeaderCB').prop('checked', data.workleaderFlag);
            $('#workleaderBox').val(data.workleaderID);
            $('#workleaderName').html(data.workleaderName);
            $('#sysAdminCB').prop('checked', data.adminFlag);
            //$('input[name=shifts]:checked').val();
            //$('input[name=shifts][value=' + data.workPeriodID + ']').prop("checked", true);
            $("#shiftBox").val(data.workPeriodID);
            $('#emailBox').val(data.emailAddress);
            $('#employeeShiftsDiv').hide();
            $('#employeeShiftsDiv').html('');
            if (data.employeeShifts.length > 0)
            {
                //show all these employees
                $('#employeeShiftsDiv').show();
                $('#employeeShiftsDiv').css('display', 'table');
                var employeeShiftsDivHTML = "";
                
                employeeShiftsDivHTML += "<div></br><h1>Employee Shifts</h1></br>";

                //loop
                for (var i = 0; i < data.employeeShifts.length; i++) {
                    
                    employeeShiftsDivHTML += "<label for = \"employeeShift_" + data.employeeShifts[i][0] + "\">" + data.employeeShifts[i][1] + ": </label><select id=\"employeeShift_" + data.employeeShifts[i][0] + "\" class = \"shiftSelect\">"
                    //loop through shifts as options, select current. "<option value=9>9</option>"
                    //document.getElementsByTagName('body')[0].onload = "";grrrrrrrrr

                    for (var j = 0; j < pageModel.shifts.length; j++) {
                        employeeShiftsDivHTML += "<option value = " + pageModel.shifts[j].shiftId + " ";
                        if (pageModel.shifts[j].shiftId == data.employeeShifts[i][2])
                            employeeShiftsDivHTML += "selected"
                        employeeShiftsDivHTML += ">" + pageModel.shifts[j].shiftName + "</option>";
                    }
                    employeeShiftsDivHTML += "</select><br /><br /><br />";
                    employeeShiftsDivHTML += "</div>";
                }

                $('#employeeShiftsDiv').html(employeeShiftsDivHTML);
                //$("#shiftBox").val(data.workPeriodID);

            }

        }
    });
}

function dashboardReport(model) {

    pageModel = JSON.parse(model)

    document.getElementsByTagName('body')[0].onload = "";

    $('#reportBoxDiv').html('');

    var timeOffListHTML = "<select id = \"reportBox\" onchange='updateReport();'>";
    for (var i = 0; i < pageModel.length; i++) {
        timeOffListHTML += "<option value = " + pageModel[i][1] + ">" + pageModel[i][0] + "</option>";
    }
    timeOffListHTML += "</select>";
    $('#reportBoxDiv').html(timeOffListHTML);

    updateReport();

}

function updateReport() {

    //get select report stuff. add to url

    var iframe = document.createElement('iframe');
    iframe.src = $('select[id=reportBox]').val();
    iframe.width = 1000;
    iframe.height = 600;
    iframe.style = 'background-color:white';

    $('#ssrsReport').empty();
    $('#ssrsReport').append(iframe);

}

function balancesPageLoad(model) {
    pageModel = JSON.parse(model);
}

function balancesReport() {

    if (!checkID())
        return;

    var id = $('#employeeBox').val();

    var iframe = document.createElement('iframe');
    iframe.src = 'http://fabdyn.fabricated.local/ReportServer?/Shop+Time+Tracking/Balance+Check&rc:Toolbar=false&EmployeeID=' + id;
    iframe.style = 'background-color:white';
    iframe.width = 1000;
    iframe.height = 600;

    //var div = document.getElementById('ssrsReport');
    
    $('#ssrsReport').empty();
    $('#ssrsReport').append(iframe);
    //div.appendChild(iframe);
}

//function testJavascript()
//{

//    var iframe = document.createElement('iframe');
//    iframe.src = 'http://fabdyn/ReportServer?/Shop+Time+Tracking/Shift+Summary+by+Workleader&WorkPeriodID=2&WorkleaderID=30008&ShiftDate=2016-12-26';
//    iframe.width = 600;
//    iframe.height = 600;

//    document.body.appendChild(iframe);
//}

function CheckJobNumber(x) {
    var jobNumber = $('#jobNumberBox' + x).val();
    var location = $('input[name=locations]:checked').val();
    var employeeId = $('#employeeBox').val();

    if (jobNumber != "" && location != undefined) {
        $.ajax({
            data: { jobNumber: jobNumber, locations: location, employeeId: employeeId },
            url: "CheckJobNumber",
            success: function (data) {
                if (!data)
                    alert("Job number not valid.");
            }
        });
    }
    else {
        alert("Missing info for job number validation");
    }

}

function submitPayrollBase(forwardURL)
{
    var location = $('input[name=locations]:checked').val();
    var punch = $('input[name=punchTypes]:checked').val();
    var employeeId = $('#employeeBox').val();

    if (checkID() && location != undefined && punch != undefined) {
        $.post(
            "PayrollSubmit",
            { location: location, punch: punch, employeeId: employeeId, webcamImage: snapshot() },
            function (data, status) {
                if (data != "") {
                    alert(data);
                }
                else {
                    $('#containerDiv').hide();
                    $('#successDiv').show();
                    //setTimeout(goHome(), 5000);
                    setTimeout(function () { window.location.href = "/ShopTimeTracking"; }, 3000);
                }
            });

    }
    else {
        alert("You are missing information for Payroll Entry");
    }
}

function goHome() {
    window.location.href = "/ShopTimeTracking";
}

function submitPayroll() {
    submitPayrollBase("/ShopTimeTracking");
}

function submitPayrollOnly()
{
    submitPayrollBase("https://fabdyn.fabricated.local:444/ShopTimeTracking/ShopTimeTracking/PayrollOnly");

}

function submitEditEmployee() {
    var employeeId = $('#employeeBox').val();
    var shiftID = $('#shiftBox').val();
    var workleadID = $('#workleaderBox').val();
    var email = $('#emailBox').val();
    var workleadFlag = $('#workLeaderCB').is(':checked');
    var sysAdminFlag = $('#sysAdminCB').is(':checked');

        //    <EmployeeWorkPeriodUpdate>
        //<Employee>
        //<EmployeeID>123</EmployeeID>
        //<WorkPeriodID>2</WorkPeriodID>
        //</Employee>	
        //<Employee>
        //<EmployeeID>456</EmployeeID>
        //<WorkPeriodID>15</WorkPeriodID>
        //</Employee>	
        //</EmployeeWorkPeriodUpdate>

    var employeeWorkPeriods = ""
    
    if (true) {
        employeeWorkPeriods += "<EmployeeWorkPeriodUpdate>";
        var selects = document.getElementsByTagName("select");
        for (var i = 0; i < selects.length; i++) {
            if (selects[i].id.split('_')[0] == 'employeeShift') {
                employeeWorkPeriods += "<Employee>";
                employeeWorkPeriods += "<EmployeeID>" + selects[i].id.split('_')[1] + "</EmployeeID>";
                employeeWorkPeriods += "<WorkPeriodID>" + selects[i].value + "</WorkPeriodID>";
                employeeWorkPeriods += "</Employee>";
            }
        }
        employeeWorkPeriods += "</EmployeeWorkPeriodUpdate>";
    }

    


    if (checkID()) {
        $.ajax({
            data: { employeeId: employeeId, shiftID: shiftID, workleadID: workleadID, email: email, workleadFlag: workleadFlag, sysAdminFlag: sysAdminFlag, employeeWorkPeriods: employeeWorkPeriods },
            url: "SubmitEditEmployee",
            success: function (data) {
                if (data != "")
                    alert(data);
                else
                    alert("Employee Updated");
            }
        });
    }
    else {
        alert("You are missing information for Editing an Employee");
    }

}

function AddJobTimeRow()
{
    var jobTimeRowsDivHTML = pageModel.jobTimeRowsHTML.split("_0").join("_" + pageModel.currentJobtimeRow);
    
    //pageModel.currentOvertimeRow++;

    $('#jobTimesListDiv').append(jobTimeRowsDivHTML);

    $('#departmentBox_' + pageModel.currentJobtimeRow).html('');
    departmentListHTML = "<select id = \"departmentBox_" + pageModel.currentJobtimeRow + "\">"
    for (var j = 0; j < pageModel.departments.length; j++) {
        if (pageModel.departments[j].locationName == $('input[name=locations]:checked').val())
            departmentListHTML += "<option value = " + pageModel.departments[j].departmentID + ">" + pageModel.departments[j].departmentNumber + "- " + pageModel.departments[j].departmentName + "</option>";
    }
    departmentListHTML += "</select>";
    $('#departmentBox_' + pageModel.currentJobtimeRow).html(departmentListHTML);

    pageModel.currentJobtimeRow++

}

function submitJobTime() {
    //jobTimesDiv

    var employeeId = $('#employeeBox').val();
    var location = $('input[name=locations]:checked').val();

    // loop through on pagemodel.jobtimerowcounter.
    var i = 0;
    var flag = false;
    while (i < pageModel.currentJobtimeRow) {

        if ($("#jobNumberBox_" + i).length > 0)  {

            var department = $('select[id=departmentBox_' + i + ']').val();
            var jobNumber = $('#jobNumberBox_' + i + '').val();
            var jobTime = parseFloat($('select[id=timeQuarterHours_' + i + ']').val()) + parseFloat($('select[id=timeHours_' + i + ']').val());
            var overTimeFlag = $('#overtimeCheck_' + i).is(':checked'); //758


            if (checkID() && location != undefined && department != undefined && location != undefined && jobTime > 0 && jobNumber != "") {
                $.ajax({
                    data: { location: location, department: department, employeeId: employeeId, jobNumber: jobNumber, jobTime: jobTime, overTimeFlag: overTimeFlag },
                    async: false,
                    url: "JobTimeSubmit",
                    success: function (data) {
                        if (data != "") {
                            flag = true;
                        }
                        else {
                            $('#jobTimesListDivSubderp_' + i).remove();
                        }

                    }
                });
            }
            else {
                flag = true;
            }
        }
        i++;
    }
    if (!flag) {
        $('#containerDiv').hide();
        $('#successDiv').show();
        setTimeout(function () { window.location.href = "/ShopTimeTracking"; }, 3000);
    }
    else {
        alert("Some job time entries experienced an error.");
    }
}

function addOvertimeRow()
{
    var overTimeRowsDivHTML = pageModel.overTimeRowsHTML.split("_0").join( "_" + pageModel.currentOvertimeRow); 

    $('#overTimeRowsDiv').append(overTimeRowsDivHTML)
    calendarInitialize(pageModel.currentOvertimeRow);
    pageModel.currentOvertimeRow++;

}

function submitOvertime(deleteFlag) {
    var overtimeID = $('select[id=overtimeBox]').val();
    var employeeId = $('#employeeBox').val();
    var workleaderID = $('#workleaderBox').val();

    
    if (isNaN(employeeId.replace(/ /g, '').replace(/,/, '')))
    {
        alert("You have an error in your employee ID list.");
        return;
    }

    var employeeIdList = employeeId.replace(/ /g, '').split(',');
    var i = 0;
    var xml = "<Overtime>";
    while ($("#startDate_" + i).length > 0) {
        for (var k = 0; k < employeeIdList.length; k++)
        {
            var overtimeStartDate = $('#startDate_' + i).val();
            var startMinutes = parseInt($('select[id=startTimeHours_' + i + ']').val()) * 60 + parseInt($('select[id=startTimeQuarterHours_' + i + ']').val()) + (($('select[id=startTimeAMPM_' + i + ']').val() == "PM") ? 12 * 60 : 0);
            var overtimeEndDate = $('#endDate_' + i).val();
            var endMinutes = parseInt($('select[id=endTimeHours_' + i + ']').val()) * 60 + parseInt($('select[id=endTimeQuarterHours_' + i + ']').val()) + (($('select[id=endTimeAMPM_' + i + ']').val() == "PM") ? 12 * 60 : 0);
            xml += "<Employee>";
            xml += "<EmployeeID>" + employeeIdList[k] + "</EmployeeID>";
            xml += "<OvertimeID>" + overtimeID + "</OvertimeID>"
            xml += "<WorkLeaderID>" + workleaderID + "</WorkLeaderID>"
            //        2017-04-03 06:21:14.000
            // 04/26/2017 480
            xml += "<OvertimeStartTime>" + overtimeStartDate + " " + ($('select[id=startTimeAMPM_' + i + ']').val() == "AM" ? "0" : "") + Math.floor(startMinutes / 60) + ":" + ((startMinutes % 60) < 10 ? "0" : "") + (startMinutes % 60) + ":00.000" + "</OvertimeStartTime>"
            xml += "<OvertimeEndTime>" + overtimeEndDate + " " + ($('select[id=endTimeAMPM_' + i + ']').val() == "AM" ? "0" : "") + Math.floor(endMinutes / 60) + ":" + ((endMinutes % 60) < 10 ? "0" : "" ) + (endMinutes % 60) + ":00.000" + "</OvertimeEndTime>"
            xml += "<DeleteFlag>" + (deleteFlag ? "1" : "") + "</DeleteFlag>"
            xml += "</Employee>";
        }
        xml += "</Overtime>";
        i++;
    }
        //<Overtime>
            //<Employee>
            //<EmployeeID>123</EmployeeID>
                //<OvertimeID>2</OvertimeID>
                //<WorkLeaderID>2</WorkLeaderID>
                //<OvertimeStartTime></OvertimeStartTime>
                //<OvertimeEndTime></OvertimeEndTime>
            //</Employee>	
            //<Employee>
                //<OvertimeID>1</EmployeeID>
                //<OvertimeID>15</OvertimeID>
                //<WorkLeaderID>2</WorkLeaderID>
                //<OvertimeStartTime></OvertimeStartTime>
                //<OvertimeEndTime></OvertimeEndTime>
            //</Employee>	
        //</Overtime>

        


        

        if (checkID()) {
            $.ajax({
                data: { xmlString : xml },
                url: "OvertimeSubmit",
                success: function (data) {
                    if (data != "")
                        alert(data);
                    else {
                        $('#containerDiv').hide();
                        $('#successDiv').show();
                        setTimeout(function () { window.location.reload(); }, 3000);
                    }
                }
            });
        }
        else {
            alert("You are missing information for Overtime Entry");
        }
     


}

function submitTimeOff(deleteFlag) {
    var overtimeID = $('select[id=overtimeBox]').val();
    var employeeId = $('#employeeBox').val();
    var workleaderID = $('#workleaderBox').val();
    var timeOffType = $('#timeOffType').val();

    var overtimeStartDate = $('#startDate').val();
    var startMinutes = parseInt($('select[id=startTimeHours]').val()) * 60 + parseInt($('select[id=startTimeQuarterHours]').val()) + (($('select[id=startTimeAMPM]').val() == "PM") ? 12 * 60 : 0);
    var overtimeEndDate = $('#endDate').val();
    var endMinutes = parseInt($('select[id=endTimeHours]').val()) * 60 + parseInt($('select[id=endTimeQuarterHours]').val()) + (($('select[id=endTimeAMPM]').val() == "PM") ? 12 * 60 : 0);

    if (checkID()) {
        $.ajax({
            data: { overtimeID: overtimeID, employeeId: employeeId, workleaderID: workleaderID, overtimeStartDate: overtimeStartDate, overtimeEndDate: overtimeEndDate, startMinutes: startMinutes, endMinutes: endMinutes, deleteFlag: deleteFlag, timeOffType: timeOffType },
            url: "TimeOffSubmit",
            success: function (data) {
                if (data != "")
                    alert(data);
                else {
                    $('#containerDiv').hide();
                    $('#successDiv').show();
                    setTimeout(function () { window.location.reload(); }, 3000);
                }
            }
        });
    }
    else {
        alert("You are missing information for Time Off Entry");
    }

}

function submitEditShifts(deleteFlag) {
    var shiftID = $('#shiftBox').val();

    var shiftXML = '';

    // <WorkPeriod>
    //  <WorkPeriodName>      </WorkPeriodName>
    //  <WorkPeriodDetailID>   </WorkPeriodDetailID>
    //  <ShiftStartDay> </ShiftStartDay>
    //  <ShiftStartTime>        </ShiftStartTime>
    //  <ShiftEndTime>     </ShiftEndTime>
    //</WorkPeriod>
    var selects = document.getElementsByTagName("select");
    for (var i = 0; i < selects.length; i++) {
        if (selects[i].id.split('_')[0] == 'startDays') {
            var id = selects[i].id.split('_')[1];

            var tdedfjkasd = ($('#endTimeAMPM_' + id).val() == "AM" ? 0 : 12);
            var sdkjsd = $('#endTimeAMPM_' + id).val();

            shiftXML += '<WorkPeriod>'
              + '<WorkPeriodName>' + $('#shiftNameBox').val() + '</WorkPeriodName>'
              + '<WorkPeriodDetailID>' + id + '</WorkPeriodDetailID>'
              + '<ShiftStartDay>' + $('#startDays_' + id).val() + '</ShiftStartDay>'
              + '<ShiftStartTime>' + (parseInt($('#startTimeHours_' + id).val()) + ($('#startTimeAMPM_' + id).val() == "AM" ? 0 : 12)) + ':' + ("00" + $('#startTimeQuarterHours_' + id).val()).slice(-2) + ':00</ShiftStartTime>'
              + '<ShiftEndTime>' + (parseInt($('#endTimeHours_' + id).val()) + ($('#endTimeAMPM_' + id).val() == "AM" ? 0 : 12)) + ':' + ("00" + $('#endTimeQuarterHours_' + id).val()).slice(-2) + ':00</ShiftEndTime>'
              + '</WorkPeriod>';
        }
    }


    
    //<Employees>
    //    <EmployeeID>123</EmployeeID>
    //    <EmployeeID>456</EmployeeID>
    //</Employees>

    var employeeWorkPeriods = ""

    if (true) {
        
        var selects = document.getElementsByTagName("select");
        for (var i = 0; i < selects.length; i++) {
            if (selects[i].id.split('_')[0] == 'employeeShift') {
                employeeWorkPeriods += "<Employee>";
                employeeWorkPeriods += "<EmployeeID>" + selects[i].id.split('_')[1] + "</EmployeeID>";
                employeeWorkPeriods += "<WorkPeriodID>" + selects[i].value + "</WorkPeriodID>";
                employeeWorkPeriods += "</Employee>";
            }
        }

    }


    $.ajax({
        data: { shiftID: shiftID, shiftXML: shiftXML, deleteFlag: deleteFlag, employeeIDList: $('#employeeIDBox').val(), employeeIDSpecificList: employeeWorkPeriods },
        url: "EditShiftsSubmit",
        async: false,
        success: function (data) {
            if (data != "")
                alert(data);
            else {
                $('#containerDiv').hide();
                $('#successDiv').show();
                setTimeout(function () { window.location.reload(); }, 3000);
            }
        }
    });
}

function submitEditPayroll() {
    var shiftID = $('#shiftBox').val();

    var shiftXML = '';

    //<PunchUpdate>
    //<PunchID>-2147483648</PunchID>
    //<PunchTime>2016-12-29 18:00:00</PunchTime>
    //<EmployeeID>854</EmployeeID>
    //<LocationID>2</LocationID>
    //<ShiftPunchType>ShiftIn</ShiftPunchType>
    //<DeleteFlag>0</DeleteFlag>
    //</PunchUpdate>
    var selects = document.getElementsByTagName("select");
    for (var i = 0; i < selects.length; i++) {
        if (selects[i].id.split('_')[0] == 'startDays') {
            var id = selects[i].id.split('_')[1];

            var tdedfjkasd = ($('#endTimeAMPM_' + id).val() == "AM" ? 0 : 12);
            var sdkjsd = $('#endTimeAMPM_' + id).val();

            shiftXML += '<WorkPeriod>'
              + '<WorkPeriodName>' + $('#shiftNameBox').val() + '</WorkPeriodName>'
              + '<WorkPeriodDetailID>' + id + '</WorkPeriodDetailID>'
              + '<ShiftStartDay>' + $('#startDays_' + id).val() + '</ShiftStartDay>'
              + '<ShiftStartTime>' + (parseInt($('#startTimeHours_' + id).val()) + ($('#startTimeAMPM_' + id).val() == "AM" ? 0 : 12)) + ':' + ("00" + $('#startTimeQuarterHours_' + id).val()).slice(-2) + ':00</ShiftStartTime>'
              + '<ShiftEndTime>' + (parseInt($('#endTimeHours_' + id).val()) + ($('#endTimeAMPM_' + id).val() == "AM" ? 0 : 12)) + ':' + ("00" + $('#endTimeQuarterHours_' + id).val()).slice(-2) + ':00</ShiftEndTime>'
              + '</WorkPeriod>';
        }
    }

    $.ajax({
        data: { shiftID: shiftID, shiftXML: shiftXML, deleteFlag: deleteFlag },
        url: "EditShiftsSubmit",
        async: false,
        success: function (data) {
            if (data != "")
                alert(data);
            else {
                $('#containerDiv').hide();
                $('#successDiv').show();
                setTimeout(function () { window.location.reload(); }, 3000);
            }
        }
    });
}

function calendarInitialize(x) {
    $("#startDate_" + x).datepicker({
        dateFormat: 'yy-mm-dd'
    });

    $("#endDate_" + x).datepicker({
        dateFormat: 'yy-mm-dd'
    });

    $("#endDate_" + x).change(function () {
        var startDate = document.getElementById("startDate_" + x).value;
        var endDate = document.getElementById("endDate_" + x).value;
        if ((Date.parse(endDate) < Date.parse(startDate))) {
            alert("End date should be greater than Start date");
            document.getElementById("endDate_" + x).value = "";
        }
    });
}

function updateOvertime() {
    $('#overtimeRowButton').hide();

    pageModel.currentOvertimeRow = 1;

    var overtimeID = $('select[id=overtimeBox]').val();

    //$('#overTimeRowsDiv').html(pageModel.overTimeRowsHTML);
    var t = 1;
    while ($("#startDate_" + t).length > 0) {
        $("#overTimeRow_" + t).remove();
        t++;
    }

    if (overtimeID == "") {
        $('#overtimeRowButton').show();
        $('#employeeBox').val('');
        $('#workleaderBox').val('');
        $('#overTimeRowsDiv').html(pageModel.overTimeRowsHTML);
        calendarInitialize(0);
        $('#deleteSubmit').hide();
        return;
    }
    $('#deleteSubmit').show();

    var i = 0;
    for (i; i < pageModel.overtimes.length; i++)
        if (pageModel.overtimes[i].overtimeID == overtimeID)
            break;

    $('#employeeName').html(pageModel.overtimes[i].employeeName);
    $('#employeeBox').val(pageModel.overtimes[i].employeeID);

    $('#workleaderBox').val(pageModel.overtimes[i].workleaderID);
    $('#workleaderName').html(pageModel.overtimes[i].workleaderName);

    var startDate = new Date(parseInt(pageModel.overtimes[i].startTime.substr(6)));
    var endDate = new Date(parseInt(pageModel.overtimes[i].endTime.substr(6)));

    $('#startTimeHours_0').val(startDate.getHours() % 12);
    $('#endTimeHours_0').val(endDate.getHours() % 12);

    $('#startTimeQuarterHours_0').val(startDate.getMinutes());
    $('#endTimeQuarterHours_0').val(endDate.getMinutes());

    $('#startTimeAMPM_0').val((startDate.getHours() >= 12 ? "PM" : "AM"));
    $('#endTimeAMPM_0').val((endDate.getHours() >= 12 ? "PM" : "AM"));

    //set dates and times
    $('#startDate_0').datepicker("setDate", startDate);
    $('#endDate_0').datepicker("setDate", endDate);

}

function updateTimeOff() {
    var overtimeID = $('select[id=overtimeBox]').val();
    if (overtimeID == "") {
        $('#employeeName').html("");
        $('#employeeBox').val("");

        $('#workleaderBox').val("");
        $('#workleaderName').html("");

        $('#startTimeHours').val(0);
        $('#endTimeHours').val(0);

        $('#startTimeQuarterHours').val(0);
        $('#endTimeQuarterHours').val(0);

        $('#startTimeAMPM').val("AM");
        $('#endTimeAMPM').val("AM");

        //set dates and times
        $('#startDate').datepicker("setDate", "");
        $('#endDate').datepicker("setDate", "");
    }


    var i = 0;
    for (i; i < pageModel.overtimes.length; i++)
        if (pageModel.overtimes[i].overtimeID == overtimeID)
            break;

    $('#employeeName').html(pageModel.overtimes[i].employeeName);
    $('#employeeBox').val(pageModel.overtimes[i].employeeID);

    $('#workleaderBox').val(pageModel.overtimes[i].workleaderID);
    $('#workleaderName').html(pageModel.overtimes[i].workleaderName);

    $('#timeOffType').val(pageModel.overtimes[i].timeOffType);

    var startDate = new Date(parseInt(pageModel.overtimes[i].startTime.substr(6)));
    var endDate = new Date(parseInt(pageModel.overtimes[i].endTime.substr(6)));

    $('#startTimeHours').val(startDate.getHours() % 12);
    $('#endTimeHours').val(endDate.getHours() % 12);

    $('#startTimeQuarterHours').val(startDate.getMinutes());
    $('#endTimeQuarterHours').val(endDate.getMinutes());

    var derp = startDate.getHours();

    $('#startTimeAMPM').val((startDate.getHours() >= 12 ? "PM" : "AM"));
    $('#endTimeAMPM').val((endDate.getHours() >= 12 ? "PM" : "AM"));

    //set dates and times
    $('#startDate').datepicker("setDate", startDate);
    $('#endDate').datepicker("setDate", endDate);

}

function adminPass() {
    $("#adminModal").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        beforeClose: function () {
            var test = adminPassSubmit();

            if (test) {
                return true;
            }
            else {
                window.location.href = "/Home";
                return false;
            }
        },
        buttons: {
            "Submit": function () {
                $(this).dialog('close');
            }
        }
    });
}

function adminPassSubmit() {
    var success;
    $.ajax({
        data: { employeeId: $('#employeeID').val(), employeePIN: $('#employeePIN').val() },
        //data: { employeeId: -99999, employeePIN: 101287 },
        url: "AdminPass",
        async: false,
        success: function (data) {
            if (data != 1) {
                success = false;
            }
            else {
                success = true;
            }
        }
    });
    return success;
}