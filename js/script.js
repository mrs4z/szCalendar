$(document).ready(function() {


    $('#ok').szCalendar({ view: 0 })
    $('#net').szCalendar({ view: 1 })

    //console.log($('#ok').szCalendar({ view: 0 }).resultDate())

    $('[obj="test1337"]').click(function() {
        console.log($('#ok').szCalendar('resultDate').stringDate)
        console.log($('#net').szCalendar('resultDate'))
    })
})