$(document).ready(function() {
    $('#calendar').szCalendar({
        method: 'multi',
        calendarsCount: 2

    })

    $('button').click(function() {
        console.log($('#calendar').szCalendar('getFullDate'))
    })

})