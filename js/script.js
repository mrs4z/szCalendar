$(document).ready(function() {
    $('#calendar').szCalendar({
        method: 'solo',

    })

    $('button').click(function() {
        console.log($('#calendar').szCalendar('getFullDate'))
    })

})