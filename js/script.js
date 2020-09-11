$(document).ready(function() {
    $('#calendar').szCalendar({
        method: 'multi',
        calendarsCount: 2,
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