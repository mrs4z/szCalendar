$(document).ready(function() {
    $('#calendar').szCalendar({
        method: 1,
        calendarsCount: 2,
        setup: true,
        input: true,
        editable: true,
        params: {
            multi: {
                start: {
                    year: 2020,
                    month: 9,
                    day: 1
                }, end: {
                    year: 2020,
                    month: 12,
                    day: 5
                }
            }
        }
    })

    $('button').click(function() {
        console.log($('#calendar').szCalendar('getFullDate'))
    })

})