(function($ ) {
    "use strict"

    const methods = {
        init: function(options) {
            // init
            let _self = $(this)

            // get type
            let getTypeTag = $(this).prop('tagName')

            // result
            // for icons
            let icons = {
                left: `<`,
                right: `>`,
                clear: `x`,
                time: {
                    up: 'UP',
                    down: 'DW',
                    double: ':'
                }
            }

            // for once item
            let activeItem = null, stateShowed = 0

            // for time
            let activeTime = {
                hours: 0,
                minutes: 0
            }

            // for interval items
            let activeItemInterval = {
                date: {
                    startDate: null,
                    startTime: null,
                    endDate: null,
                    endTime: null
                },
                state: 0      // 0 - not active, 1 - selection
            }

            let resultSettings = {
                settings: null,
                dom: null,
                date: null,
                elements: {
                    inputDom: null
                },
                type: null,
                self: null
            }

            // result icons
            let resultICONS = typeof szCalendarICONS != "undefined" ? szCalendarICONS : icons



            ////////////////////// FOR RESULT /////////////////////
            let resultDate = null

            function updateResultDate() {
                if(resultSettings.settings.type == 0) {
                    resultDate = {
                        stampDate: Utils.dateToFormat(activeItem, true).stampDate,
                        stringDate: Utils.dateSimple(activeItem, true)
                    }
                } else {
                    resultDate = {
                        start: {
                            stampDate: Utils.dateToFormat({ date: activeItemInterval.date.startDate, time: activeItemInterval.date.startTime }).stampDate,
                            stringDate: Utils.dateSimple(activeItemInterval.date.startDate, true)
                        },
                        end: {
                            stampDate: Utils.dateToFormat({ date: activeItemInterval.date.endDate, time: activeItemInterval.date.endTime }).stampDate,
                            stringDate: Utils.dateSimple(activeItemInterval.date.endDate, true)
                        }
                    }
                }

                $(_self).data('getData', resultDate)
            }

            function updateResultTime() {
                let resultTime = `${activeTime.hours}:${activeTime.minutes}`

                $(_self).data('getData', resultTime);
            }


            const symbolsSplit = /[. | \/ | -]+/

            const Utils = {
                dateToFormat: function (date, normalDate = false) {
                    let resultDate = null, stampDate = 0

                    if (Object.prototype.toString.call(date) == "[object Object]") {
                        // split date
                        let splitDate = date.date.split('-').map(Number)

                        // result
                        resultDate = {
                            year: splitDate[0],
                            month: !normalDate ? splitDate[1] + 1 : splitDate[1],
                            day: splitDate[2]
                        }

                        // get date
                        let splitTime = date.time.split(':')

                        // timestamp
                        stampDate = new Date(resultDate.year, splitDate[1], resultDate.day, splitTime[0], splitTime[1]).getTime()
                    } else if (Object.prototype.toString.call(date) == "[object Number]") {
                        let createDate = new Date(date)

                        // to timestamp
                        stampDate = createDate.getTime()

                        // result
                        resultDate = {
                            year: createDate.getFullYear(),
                            month: !normalDate ? createDate.getMonth() + 1 : createDate.getMonth(),
                            day: createDate.getDate()
                        }
                    } else {
                        // split date
                        let splitDate = date.split('-').map(Number)

                        // result
                        resultDate = {
                            year: splitDate[0],
                            month: !normalDate ? splitDate[1] + 1 : splitDate[1],
                            day: splitDate[2]
                        }

                        // timestamp
                        stampDate = new Date(resultDate.year, splitDate[1], resultDate.day).getTime()
                    }

                    let updateYear = resultSettings.settings.format.replace('YYYY', resultDate.year)
                    let updateMonth = updateYear.replace('mm', resultDate.month)
                    let updateDate = updateMonth.replace('dd', resultDate.day)

                    return {
                        stampDate: stampDate,
                        stringDate: updateDate
                    }
                },
                checkAndFormat: function (date) {
                    let getDate = resultSettings.settings.format.split(symbolsSplit),
                        getRealDate = Object.prototype.toString.call(date) == "[object Date]" ? Utils.dateToFormat(date.getTime()).stringDate.split(symbolsSplit).map(Number) : date.split(symbolsSplit).map(Number),
                        resultDate = null, formatByPattern = null

                    // if splitted ok
                    if (getRealDate.length > 0) {
                        formatByPattern = formatToDefault(getDate, getRealDate)
                        resultDate = Utils.dateToFormat(formatByPattern).stringDate
                    }

                    function formatToDefault(listPattern, listReal) {
                        let result = {year: 0, month: 0, day: 0}

                        $.each(listPattern, function (index, item) {
                            if (item == 'YYYY') {
                                result.year = listReal[index]
                            } else if (item == 'mm') {
                                result.month = listReal[index]
                            } else {
                                result.day = listReal[index]
                            }
                        })

                        return new Date(result.year, result.month - 1, result.day).getTime()
                    }

                    return {
                        stringDate: resultDate,
                        stampDate: formatByPattern
                    }
                },
                dateSimple: function (date, toNormal = false) {
                    let resultDate = null
                    if (Object.prototype.toString.call(date) == "[object Number]") {
                        // cr
                        let createDate = new Date(date)
                        resultDate = [createDate.getFullYear(), createDate.getMonth() + 1, createDate.getDate()]
                    } else {
                        // split date
                        resultDate = date.split('-').map(Number)
                    }

                    console.log(resultDate)


                    let resultMonth = toNormal ? resultDate[1] + 1 : resultDate[1] - 1

                    return `${resultDate[0]}-${resultMonth}-${resultDate[2]}`
                },
                dateTime: function (date) {
                    // ge type
                    let getType = Object.prototype.toString.call(date), resultItem = null

                    if (getType == "[object Number]") {
                        // create date
                        let createDate = new Date(date)

                        resultItem = `${createDate.getHours()}:${createDate.getMinutes()}`
                    } else if (getType == "[object String]") {
                        let splitDate = date.split(' ')

                        if (splitDate.length > 0) {
                            let splitTime = splitDate[1].split(':').map(Number)
                            resultItem = `${splitTime[0]}-${splitTime[1]}`
                        } else {
                            resultItem = '00:00'
                        }
                    } else {
                        resultItem = '00:00'
                    }

                    return resultItem
                },
                showCalendarDate: function () {
                    let getType = resultSettings.settings.showDate,
                        callObject = Object.prototype.toString.call(getType), resultDate = null

                    // array interval
                    if (callObject == "[object Date]") {
                        resultDate = {month: getType.getMonth() + 1, year: getType.getFullYear()}

                    } else if (callObject == "[object Number]") {
                        // format
                        let toNormalDate = new Date(getType)

                        // result
                        resultDate = {month: toNormalDate.getMonth() + 1, year: toNormalDate.getFullYear()}
                    }

                    return resultDate
                },
                showStartDate: function () {
                    let getType = resultSettings.settings.startDate,
                        callObject = Object.prototype.toString.call(getType), resultDate = null

                    if (callObject == "[object Array]") {
                        let resultItem = []

                        // get interval
                        $.each(getType, function (index, item) {
                            let callItem = Object.prototype.toString.call(item)

                            resultItem.push(Utils.dateToFormat(item, false).stringDate)
                        })

                        // result date
                        resultDate = resultItem
                    } else if (callObject == "[object Date]") {
                        resultDate = {month: getType.getMonth() + 1, year: getType.getFullYear()}

                    } else if (callObject == "[object Number]") {
                        // format
                        let toNormalDate = new Date(getType)

                        // result
                        resultDate = {month: toNormalDate.getMonth() + 1, year: toNormalDate.getFullYear()}
                    }

                    return resultDate
                }, getIcon: function () {
                    return resultICONS
                }
            }

            const calendarInit = {
                createCalendar: function (month, year) {
                    // dom create
                    let $createDOM = $(`<table>
                                <thead>
                                <th>пн</th>
                                <th>вт</th>
                                <th>ср</th>
                                <th>чт</th>
                                <th>пт</th>
                                <th>сб</th>
                                <th>вс</th>
                                </thead>
                                <tbody></tbody>
                            </table>`)

                    // create to day date
                    let createToDayDate = new Date()

                    // dates
                    let jsMONTH = month - 1

                    // create
                    let createDate = new Date(year, jsMONTH)

                    let minDate = new Date(createDate.getFullYear(), createDate.getMonth() - 1, 0)
                    let maxDate = new Date(createDate.getFullYear(), createDate.getMonth() + 1, 0)

                    // start dom
                    let $createLine = '<tr>'

                    // start nulled params
                    for (let i = 0; i < getDay(createDate); i++) {
                        let isDisabled = false,
                            resultDate = `${minDate.getFullYear()}-${minDate.getMonth() + 1}-${minDate.getDate() - getDay(createDate) + i + 1}`

                        // check disabled date
                        if (resultSettings.settings.maxDate) {
                            if (Utils.dateToFormat(resultDate, true).stampDate >= Utils.dateToFormat(resultSettings.settings.maxDate, true).stampDate)
                                isDisabled = true
                        }

                        $createLine += `<td class="around ${isDisabled ? 'dateDisabled ' : ' '}" data-real="${minDate.getFullYear()}-${minDate.getMonth() + 1}-${minDate.getDate() - getDay(createDate) + i + 1}" data-event="${isDisabled ? '' : 'select-date'}">${minDate.getDate() - getDay(createDate) + i + 1}</td>`
                    }

                    while (createDate.getMonth() == jsMONTH) {
                        /** !!! CREATE ELEMENT DATE ITEM !!! */
                        let resultDate = `${createDate.getFullYear()}-${jsMONTH}-${createDate.getDate()}`

                        // check if's
                        let isToDay = false, isDisabled = false

                        // check disabled date
                        if (resultSettings.settings.maxDate) {
                            if (Utils.dateToFormat(resultDate, true).stampDate >= Utils.dateToFormat(resultSettings.settings.maxDate, true).stampDate)
                                isDisabled = true
                        }

                        // check to day
                        if (createToDayDate.getFullYear() == createDate.getFullYear() && createToDayDate.getMonth() == createDate.getMonth() && createToDayDate.getDate() == createDate.getDate())
                            isToDay = true

                        // result
                        $createLine += `<td class="${isToDay ? 'toDay ' : ' '} ${isDisabled ? 'dateDisabled ' : ' '} ${resultSettings.settings.elements.inputsDisabled ? 'cursor-not ' : ' '}" data-real="${resultDate}" data-event="${isDisabled ? '' : 'select-date'}">${createDate.getDate()}</td>`

                        if (getDay(createDate) % 7 == 6) {
                            $createLine += `</tr><tr>`
                        }

                        createDate.setDate(createDate.getDate() + 1);
                    }

                    // start
                    let startDate = 1

                    // last
                    for (let i = getDay(createDate); i < 7; i++) {
                        let isDisabled = false,
                            resultDate = `${maxDate.getFullYear()}-${maxDate.getMonth() + 1}-${startDate}`

                        // check disabled date
                        if (resultSettings.settings.maxDate) {
                            if (Utils.dateToFormat(resultDate, true).stampDate >= Utils.dateToFormat(resultSettings.settings.maxDate, true).stampDate)
                                isDisabled = true
                        }

                        $createLine += `<td class="around ${isDisabled ? 'dateDisabled ' : ' '}" data-real="${maxDate.getFullYear()}-${maxDate.getMonth() + 1}-${startDate}" data-event="${isDisabled ? '' : 'select-date'}">${startDate}</td>`
                        startDate++
                    }

                    $createLine += '</tr>'

                    $createDOM.find('tbody').append($createLine)

                    // upper to line
                    let getCountLines = $createDOM.find('tbody').find('tr').length, $lineApp = ``


                    if (getCountLines > 4 && getCountLines < 6) {
                        $lineApp += '<tr>'

                        for (let i = 0; i < 7; i++) {

                            let isDisabled = false,
                                resultDate = `${maxDate.getFullYear()}-${maxDate.getMonth() + 1}-${startDate}`

                            // check disabled date
                            if (resultSettings.settings.maxDate) {
                                if (Utils.dateToFormat(resultDate, true).stampDate >= Utils.dateToFormat(resultSettings.settings.maxDate, true).stampDate)
                                    isDisabled = true
                            }

                            $lineApp += `<td class="around ${isDisabled ? 'dateDisabled ' : ' '}" data-real="${maxDate.getFullYear()}-${maxDate.getMonth() + 1}-${startDate}" data-event="${isDisabled ? '' : 'select-date'}">${startDate}</td>`
                            startDate++
                        }

                        $lineApp += '</tr>'
                    }

                    $createDOM.find('tbody').append($lineApp)

                    function getDay(date) {
                        var day = date.getDay();
                        if (day == 0) day = 7;
                        return day - 1;
                    }

                    return $createDOM
                },
                once: {
                    oneSelectEvent: function (dom) {
                        dom.find('[data-event="select-date"]').click(function (e) {
                            if (resultSettings.type == 'INPUT') {
                                resultSettings.self.focus()
                            }

                            if (activeItem != null) {
                                resultSettings.dom.find(`[data-real=${activeItem}]`).removeClass('active')
                                activeItem = null
                            }

                            // self
                            activeItem = $(this).attr('data-real')
                            resultSettings.dom.find(`[data-real=${activeItem}]`).addClass('active')

                            // by type
                            if (resultSettings.type == 'INPUT') {
                                resultSettings.self.val(Utils.dateToFormat(activeItem).stringDate)
                            }

                            if (resultSettings.settings.closeBySelect) {
                                resultSettings.dom.hide()
                                stateShowed = 0
                            }

                            updateResultDate()

                            // blur
                            if (resultSettings.type == 'INPUT') {
                                resultSettings.self.blur()
                            }

                        })
                    },
                    loadSelectedItem: function () {
                        if (activeItem != null) {
                            resultSettings.dom.find(`[data-real="${activeItem}"]`).addClass('active')
                        }
                    }
                },
                interval: {
                    intervalSelectEvent: function (dom) {
                        if (resultSettings.settings.elements.inputsDisabled)
                            return false

                        // event click
                        dom.find('[data-event="select-date"]').click(function (e) {
                            if (activeItemInterval.state == 0) {
                                // clear
                                if (activeItemInterval.date.startDate != null) {
                                    // clear class
                                    resultSettings.dom.find(`[data-real=${activeItemInterval.date.startDate}]`).removeClass('active')
                                    resultSettings.dom.find(`[data-real=${activeItemInterval.date.endDate}]`).removeClass('active')

                                    // date
                                    activeItemInterval.date.startDate = null
                                    activeItemInterval.date.endDate = null

                                    // time
                                    activeItemInterval.date.startTime = null
                                    activeItemInterval.date.endTime = null
                                }

                                // result
                                calendarInit.interval.intervalRangeStyleClear()
                                calendarInit.interval.clearIntervalClass()

                                activeItemInterval.date.startDate = $(this).attr('data-real')
                                activeItemInterval.date.startTime = "00:00"
                                resultSettings.dom.find(`[data-real=${activeItemInterval.date.startDate}]`).addClass('active')

                                // change state
                                activeItemInterval.state = 1

                                // for input interval
                                if (resultSettings.settings.elements.inputs) {
                                    // clear input
                                    let getInput = resultSettings.dom.find('[data-type="input-interval"][data-interval-id="1"]')
                                    // focus & clear & append
                                    getInput.focus()
                                    getInput.val(Utils.dateToFormat($(this).attr('data-real')).stringDate)
                                }

                                calendarInit.elements.stepActive.setStepActive(1)
                            } else {
                                let checkDate = null

                                // check
                                if (Utils.dateToFormat($(this).attr('data-real')).stampDate < Utils.dateToFormat(activeItemInterval.date.startDate).stampDate) {
                                    return false
                                }


                                if (Utils.dateToFormat($(this).attr('data-real')).stampDate < Utils.dateToFormat(activeItemInterval.date.startDate).stampDate) {
                                    let createDateNew = new Date(Utils.dateToFormat(activeItemInterval.date.startDate, true).stampDate)
                                    checkDate = `${createDateNew.getFullYear()}-${createDateNew.getMonth()}-${createDateNew.getDate()}`
                                } else {
                                    checkDate = $(this).attr('data-real')
                                }

                                // end item
                                activeItemInterval.date.endDate = checkDate
                                activeItemInterval.date.endTime = '23:59'
                                resultSettings.dom.find(`[data-real=${activeItemInterval.date.endDate}]`).addClass('active')

                                // update date
                                updateResultDate()

                                // change state
                                activeItemInterval.state = 0

                                // for input interval
                                if (resultSettings.settings.elements.inputs) {
                                    // clear input
                                    let getInput = resultSettings.dom.find('[data-type="input-interval"][data-interval-id="2"]')
                                    // focus & clear & append
                                    getInput.focus()
                                    getInput.val(Utils.dateToFormat(checkDate).stringDate)
                                }

                                calendarInit.elements.stepActive.setStepActive(2)
                            }
                        })

                        // for selector
                        dom.find('[data-event="select-date"]').hover(function (e) {
                            if (activeItemInterval.state == 1) {
                                calendarInit.interval.intervalStyle(activeItemInterval.date.startDate, $(this).attr('data-real'))
                            }
                        })
                    },
                    intervalRangeStyle: function (start, end) {
                        // set start & end interval
                        start != null ? resultSettings.dom.find(`[data-real="${start}"]`).addClass('active') : null
                        end != null ? resultSettings.dom.find(`[data-real="${end}"]`).addClass('active') : null
                    },
                    intervalRangeStyleClear: function () {
                        resultSettings.dom.find('.active').removeClass('active')
                    },
                    intervalStyle: function (start, end) {
                        // get date start
                        let getStartDate = start.split('-').map(Number)
                        let getHoverDate = end.split('-').map(Number)

                        // result
                        calendarInit.interval.clearIntervalClass()

                        // load
                        for (let year = getStartDate[0]; year <= getHoverDate[0]; year++) {
                            let startMonth = 0, endMonth = 0

                            if (getStartDate[1] == 11 && getStartDate[0] < getHoverDate[0]) {
                                if (year > getStartDate[0]) {
                                    startMonth = 0
                                    endMonth = getHoverDate[1]
                                } else {
                                    startMonth = 11
                                    endMonth = 11
                                }
                            } else {
                                startMonth = getStartDate[1]
                                endMonth = getHoverDate[1]
                            }

                            for (let month = startMonth; month <= endMonth; month++) {
                                let startDay = 0, endDay = 0

                                if (getStartDate[1] == 11 && getStartDate[0] < getHoverDate[0]) {
                                    if (getStartDate[1] != month && getHoverDate[1] != month) {
                                        startDay = 0
                                        endDay = 32
                                    } else {
                                        if (year == getStartDate[0]) {
                                            startDay = getStartDate[2]
                                            endDay = 32
                                        } else {
                                            startDay = 0
                                            endDay = getHoverDate[2]
                                        }
                                    }
                                } else {
                                    // check month
                                    if (getStartDate[1] != month && getHoverDate[1] != month) {
                                        startDay = 0
                                        endDay = 32
                                    } else if (getStartDate[1] == month && getStartDate[1] < getHoverDate[1]) {
                                        startDay = getStartDate[2]
                                        endDay = 32
                                    } else if (month == getHoverDate[1] && getStartDate[1] < getHoverDate[1]) {
                                        startDay = 1
                                        endDay = getHoverDate[2]
                                    } else {
                                        startDay = getStartDate[2]
                                        endDay = getHoverDate[2]
                                    }
                                }

                                for (let day = startDay; day < endDay; day++) {
                                    resultSettings.dom.find(`[data-real="${year}-${month}-${day}"]`).addClass('selected')
                                }
                            }
                        }
                    },
                    clearIntervalClass: function () {
                        resultSettings.dom.find('.selected').removeClass('selected')
                    }
                },
                barItem: {
                    resultRealMonth: function (month, year) {
                        let ListMonths = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек']

                        return `${ListMonths[month - 1]}. ${year}`
                    },
                    getDate: function () {
                        // real date to js month
                        let getRealMonth = resultSettings.date.month

                        // result
                        return {
                            leftPart: {month: getRealMonth, year: resultSettings.date.year},
                            rightPart: {
                                month: getRealMonth + 1 == 13 ? 1 : getRealMonth + 1,
                                year: getRealMonth + 1 == 13 ? resultSettings.date.year + 1 : resultSettings.date.year
                            },
                        }
                    },
                    setBarByDate: function () {
                        if (resultSettings.settings.count == 1) {
                            // get data
                            let getLeftPart = calendarInit.barItem.getDate().leftPart

                            // update
                            resultSettings.dom.find('[data-change="name-data"]').html(`${calendarInit.barItem.resultRealMonth(getLeftPart.month, getLeftPart.year)}`)
                        } else {
                            let getRightPart = calendarInit.barItem.getDate().rightPart
                            let getLeftPart = calendarInit.barItem.getDate().leftPart

                            // two calendars
                            resultSettings.dom.find('[data-change="prev-data"]').html(`${calendarInit.barItem.resultRealMonth(getLeftPart.month, getLeftPart.year)}`)
                            resultSettings.dom.find('[data-change="next-data"]').html(`${calendarInit.barItem.resultRealMonth(getRightPart.month, getRightPart.year)}`)
                        }
                    },
                    onChangeMonth: function () {
                        resultSettings.dom.find('[data-event="change"]').click(function () {
                            // get type
                            let getType = $(this).attr('data-type')
                            let getDate = resultSettings.date, resultDate = null

                            // mex
                            if (getType == 'next') {
                                resultDate = {
                                    month: getDate.month + 1 == 13 ? 1 : getDate.month + 1,
                                    year: getDate.month + 1 == 13 ? getDate.year + 1 : getDate.year
                                }
                            } else {
                                resultDate = {
                                    month: getDate.month - 1 == 0 ? 12 : getDate.month - 1,
                                    year: getDate.month - 1 == 0 ? getDate.year - 1 : getDate.year
                                }
                            }

                            // update date & calendar
                            resultSettings.date = resultDate

                            calendarInit.updateCalendar()
                        })
                    }

                },
                setUp: function () {
                    // set pre load params
                    if (resultSettings.settings.startDate != null) {
                        if (resultSettings.settings.elements.inputs) {
                            if (resultSettings.settings.type == 0) {
                                resultSettings.dom.find('[data-type="input-interval"][data-interval-id="1"]').val('ok da')
                            } else {
                                console.log(Utils.showStartDate())
                                resultSettings.dom.find('[data-type="input-interval"][data-interval-id="1"]').val(Utils.showStartDate()[0])
                                resultSettings.dom.find('[data-type="input-interval"][data-interval-id="2"]').val(Utils.showStartDate()[1])
                            }
                        }

                        if (resultSettings.settings.type == 1) {
                            // set
                            activeItemInterval.date.startDate = Utils.dateSimple(resultSettings.settings.startDate[0])
                            activeItemInterval.date.startTime = Utils.dateTime(resultSettings.settings.startDate[0])

                            activeItemInterval.date.endDate = Utils.dateSimple(resultSettings.settings.startDate[1])
                            activeItemInterval.date.endTime = Utils.dateTime(resultSettings.settings.startDate[1])

                            updateResultDate()
                        } else {
                            activeItem = Utils.dateSimple(resultSettings.settings.startDate)
                        }
                    }

                    // update calendar
                    calendarInit.updateCalendar()

                    if (resultSettings.settings.startDate != null) {
                        if (resultSettings.settings.type == 1) {
                            // update
                            calendarInit.interval.intervalStyle(activeItemInterval.date.startDate, activeItemInterval.date.endDate)
                        }
                    }

                    // add events
                    calendarInit.barItem.onChangeMonth()
                    calendarInit.elements.stepActive.setStepActive(0)
                },
                updateCalendar: function () {
                    // create calendars
                    let $domCalendar = calendarInit.createCalendar(calendarInit.barItem.getDate().leftPart.month, calendarInit.barItem.getDate().leftPart.year),
                        $domCalendarTwo = null

                    if (resultSettings.settings.count == 2)
                        $domCalendarTwo = calendarInit.createCalendar(calendarInit.barItem.getDate().rightPart.month, calendarInit.barItem.getDate().rightPart.year)

                    // append to all dom
                    resultSettings.dom.find('[data-calendar="1"]').html($domCalendar)

                    if (resultSettings.settings.count == 2)
                        resultSettings.dom.find('[data-calendar="2"]').html($domCalendarTwo)

                    if (resultSettings.settings.type == 1) {
                        if (activeItemInterval.date.startDate) {
                            calendarInit.interval.intervalRangeStyle(activeItemInterval.date.startDate, activeItemInterval.date.endDate)

                            if (activeItemInterval.state != 1)
                                calendarInit.interval.intervalStyle(activeItemInterval.date.startDate, activeItemInterval.date.endDate)
                        }

                        // TODO : SET UP INTERVAL AND ONCE EVENTS
                        calendarInit.interval.intervalSelectEvent($domCalendar)

                        if (resultSettings.settings.count == 2)
                            calendarInit.interval.intervalSelectEvent($domCalendarTwo)

                    } else {
                        calendarInit.once.oneSelectEvent($domCalendar)

                        if (resultSettings.settings.count == 2)
                            calendarInit.once.oneSelectEvent($domCalendarTwo)

                        calendarInit.once.loadSelectedItem()
                    }

                    // set bars
                    calendarInit.barItem.setBarByDate()
                },
                createFullDomCalendar: function () {
                    // result DOM
                    let resultDOM = ``
                    if (resultSettings.settings.count == 1) {
                        resultDOM = `<div class="szCalendar__column">
                                    <div class="szCalendar__row szCalendar__margin-bottom-10 szCalendar__row-buttons szCalendar__flex-padding szCalendar__flex-sb">
                                        <div data-event="change" data-type="prev">${Utils.getIcon().left}</div>
                                        <div data-change="name-data"></div>
                                        <div data-event="change" data-type="next">${Utils.getIcon().right}</div>
                                    </div>
                                    <div data-calendar="1"></div>
                                </div>`
                    } else {
                        resultDOM = `<div class="szCalendar__row szCalendar__flex-padding">
                                            <div class="szCalendar__column">
                                                <div class="szCalendar__row szCalendar__margin-bottom-10 szCalendar__row-buttons szCalendar__flex-padding szCalendar__flex-sb">
                                                    <div data-event="change" data-type="prev">${Utils.getIcon().left}</div>
                                                    <div data-change="prev-data"></div>
                                                </div>
                                                <div data-calendar="1"></div>
                                            </div>
                                            <div class="szCalendar__column">
                                                <div class="szCalendar__row szCalendar__margin-bottom-10 szCalendar__row-buttons szCalendar__flex-padding szCalendar__flex-sb">
                                                    <div data-change="next-data"></div>
                                                    <div data-event="change" data-type="next">${Utils.getIcon().right}</div>
                                                </div>
                                                <div data-calendar="2"></div>
                                            </div>
                                        </div>`
                    }

                    return resultDOM
                },
                time: {
                    onChangeTime: function () {
                        // max consts
                        const MAX_HOUR = 24, MAX_MIN = 60

                        // set event
                        // up/down hour
                        resultSettings.dom.find('[data-event="hour"]').click(function (e) {
                            // pr
                            e.preventDefault()

                            // get attr
                            let getType = $(this).attr('data-time-type')

                            if (getType == 'up') {
                                activeTime.hours = activeTime.hours + 1 == 24 ? 0 : activeTime.hours + 1
                            } else {
                                activeTime.hours = activeTime.hours - 1 < 0 ? 23 : activeTime.hours - 1
                            }

                            calendarInit.time.onUpdateInput()
                        })

                        // up/down hour
                        resultSettings.dom.find('[data-event="minutes"]').click(function (e) {
                            // pr
                            e.preventDefault()

                            // get attr
                            let getType = $(this).attr('data-time-type')

                            if (getType == 'up') {
                                activeTime.minutes = activeTime.minutes + 1 == 60 ? 0 : activeTime.minutes + 1
                            } else {
                                activeTime.minutes = activeTime.minutes - 1 < 0 ? 59 : activeTime.minutes - 1
                            }

                            calendarInit.time.onUpdateInput()
                        })

                        // inout
                        resultSettings.dom.find('[data-input="hours"]').on('input', function (e) {
                            // get val
                            let getVal = parseInt($(this).val())

                            if (getVal > 23) {
                                activeTime.hours = 23
                            } else if (getVal < 0 || isNaN(getVal)) {
                                activeTime.hours = 0
                            } else {
                                activeTime.hours = getVal
                            }

                            $(this).val(activeTime.hours)

                            calendarInit.time.onUpdateInputCall()
                            updateResultTime()
                        })

                        // inout
                        resultSettings.dom.find('[data-input="minutes"]').on('input', function (e) {
                            // get val
                            let getVal = parseInt($(this).val())

                            if (getVal > 59) {
                                activeTime.minutes = 59
                            } else if (getVal < 0 || isNaN(getVal)) {
                                activeTime.minutes = 0
                            } else {
                                activeTime.minutes = getVal
                            }

                            $(this).val(activeTime.minutes)

                            calendarInit.time.onUpdateInputCall()
                            updateResultTime()
                        })
                    },
                    onUpdateInput: function () {
                        resultSettings.dom.find('[data-input="hours"]').val(calendarInit.time.onFormatInput().hours)
                        resultSettings.dom.find('[data-input="minutes"]').val(calendarInit.time.onFormatInput().minutes)

                        calendarInit.time.onUpdateInputCall()
                        updateResultTime()
                    },
                    onUpdateInputCall: function() {
                        if (resultSettings.type == 'INPUT') {
                            resultSettings.self.val(`${calendarInit.time.onFormatInput().hours}:${calendarInit.time.onFormatInput().minutes}`)
                        }
                    },
                    onFormatInput: function() {
                        let resultHour, resultMinutes

                        resultHour = activeTime.hours < 10 ? "0" + activeTime.hours : activeTime.hours
                        resultMinutes = activeTime.minutes < 10 ? "0" + activeTime.minutes : activeTime.minutes

                        return {
                            hours: resultHour,
                            minutes: resultMinutes
                        }
                    },
                    setUpTime: function() {
                        // get val
                        if (resultSettings.type == 'INPUT') {
                            let getInput = resultSettings.self.val()

                            console.log(getInput)

                            // check
                            if(getInput.length > 0 && getInput.split(':').length > 0) {
                                let resultSplit = getInput.split(':').map(Number)

                                console.log('test ??????? ', resultSplit)

                                // update
                                activeTime.hours = resultSplit[0]
                                activeTime.minutes = resultSplit[1]

                                resultSettings.dom.find('[data-input="hours"]').val(calendarInit.time.onFormatInput().hours)
                                resultSettings.dom.find('[data-input="minutes"]').val(calendarInit.time.onFormatInput().minutes)

                                updateResultTime()
                            }
                        }
                    }
                },
                elements: {
                    createInputs: function () {
                        // for dom result
                        let createDom = ``

                        if (resultSettings.settings.elements.inputs) {
                            // settings
                            if (resultSettings.settings.type == 1) {
                                createDom = `<div class="szCalendar__row szCalendar__flex-ac szCalendar__margin-bottom-10 szCalendar__row-inputs szCalendar__flex-padding szCalendar__flex-wrap">
                                            <div>Диапазон:</div>
                                            <div><input type="text" data-type="input-interval" data-interval-id="1" ${resultSettings.settings.elements.inputsDisabled ? 'disabled' : ''} /></div>
                                            <div>&mdash;</div>
                                            <div><input type="text" data-type="input-interval" data-interval-id="2" ${resultSettings.settings.elements.inputsDisabled ? 'disabled' : ''} /></div>
                                            ${resultSettings.settings.clearDate && !resultSettings.settings.elements.inputsDisabled ? `<div class="szCalendar__icon-clear" data-event="clear">${Utils.getIcon().clear}</div>` : ``}
                                        </div>`
                            } else {
                                createDom = ``
                            }
                        }

                        return {
                            dom: createDom,
                            setUpEvent: function () {
                                if (resultSettings.settings.elements.inputs) {
                                    resultSettings.dom.find('[data-type="input-interval"]').on('change', function (e) {
                                        // get type
                                        let getInput = $(this)
                                        let getDate = Utils.checkAndFormat(getInput.val().length < 8 ? new Date() : getInput.val())

                                        if (getDate.stringDate != null) {
                                            // update
                                            $(this).val(getDate.stringDate)

                                            // get date
                                            let createDate = new Date(getDate.stampDate)

                                            // start date
                                            if (getInput.attr('data-interval-id') == "1") {

                                                // get two interval
                                                let getIntervalTwo = Utils.checkAndFormat(resultSettings.dom.find('[data-type="input-interval"][data-interval-id="2"]').val().length < 8 ? new Date() : resultSettings.dom.find('[data-type="input-interval"][data-interval-id="2"]').val())

                                                if (getIntervalTwo.stampDate < getDate.stampDate) {
                                                    let createDateIntervalTwo = new Date(getIntervalTwo.stampDate)

                                                    activeItemInterval.date.startDate = `${createDateIntervalTwo.getFullYear()}-${createDateIntervalTwo.getMonth()}-${createDateIntervalTwo.getDate()}`
                                                    activeItemInterval.date.endDate = `${createDateIntervalTwo.getFullYear()}-${createDateIntervalTwo.getMonth()}-${createDateIntervalTwo.getDate()}`

                                                    // update inputs
                                                    $(this).val(getIntervalTwo.stringDate)
                                                    resultSettings.dom.find('[data-type="input-interval"][data-interval-id="2"]').val(getIntervalTwo.stringDate)
                                                } else {
                                                    activeItemInterval.date.startDate = `${createDate.getFullYear()}-${createDate.getMonth()}-${createDate.getDate()}`
                                                }
                                            } else {
                                                // get two interval
                                                let getIntervalOne = Utils.checkAndFormat(resultSettings.dom.find('[data-type="input-interval"][data-interval-id="1"]').val().length < 8 ? new Date() : resultSettings.dom.find('[data-type="input-interval"][data-interval-id="1"]').val())

                                                if (getIntervalOne.stampDate > getDate.stampDate) {
                                                    let createDateIntervalTwo = new Date(getIntervalOne.stampDate)

                                                    activeItemInterval.date.startDate = `${createDateIntervalTwo.getFullYear()}-${createDateIntervalTwo.getMonth()}-${createDateIntervalTwo.getDate()}`
                                                    activeItemInterval.date.endDate = `${createDateIntervalTwo.getFullYear()}-${createDateIntervalTwo.getMonth()}-${createDateIntervalTwo.getDate()}`

                                                    // update inputs
                                                    $(this).val(getIntervalOne.stringDate)
                                                    resultSettings.dom.find('[data-type="input-interval"][data-interval-id="2"]').val(getIntervalOne.stringDate)
                                                } else {
                                                    activeItemInterval.date.endDate = `${createDate.getFullYear()}-${createDate.getMonth()}-${createDate.getDate()}`
                                                }
                                            }

                                            calendarInit.updateCalendar()
                                        }

                                    })
                                }
                            }
                        }
                    },
                    stepActive: {
                        createStepActive: function () {
                            let $resultDOM = ``

                            if (resultSettings.settings.showStepsInfo.enable) {
                                $resultDOM = `<div class="szCalendar__step" data-event="step" data-step="0"></div>`
                            }

                            return $resultDOM
                        }, setStepActive: function (id) {
                            // dom
                            let getDOM = resultSettings.dom.find(`[data-event="step"]`)

                            // add class
                            getDOM.removeClass('active').removeClass('success')

                            // res
                            getDOM.html(resultSettings.settings.showStepsInfo.stepsText[id].text)
                            getDOM.attr('data-step', resultSettings.settings.showStepsInfo.stepsText[id].id)

                            if (id == 1) {
                                getDOM.addClass('active')
                            } else if (id == 2) {
                                getDOM.addClass('success')
                            }
                        }
                    }, onClear: function () {
                        // if settings on input
                        if (resultSettings.settings.clearDate) {
                            resultSettings.dom.find('[data-event="clear"]').click(function () {
                                // date
                                activeItemInterval.date.startDate = null
                                activeItemInterval.date.endDate = null

                                // time
                                activeItemInterval.date.startTime = null
                                activeItemInterval.date.endTime = null

                                // calendar
                                calendarInit.interval.clearIntervalClass()
                                calendarInit.interval.intervalRangeStyleClear()

                                // clear input
                                resultSettings.dom.find('[data-type="input-interval"][data-interval-id="1"]').val('')
                                resultSettings.dom.find('[data-type="input-interval"][data-interval-id="2"]').val('')

                                // set step
                                if (resultSettings.settings.showStepsInfo.enable) {
                                    calendarInit.elements.stepActive.setStepActive(0)
                                }
                            })
                        }
                    }
                }
            }

            // update type
            resultSettings.type = getTypeTag
            resultSettings.elements.inputDom = this
            resultSettings.self = _self

            // settings
            const settings = $.extend({
                view: 0,    // 0 - calendar, 1 - time
                type: 0,    // 0 - one, 1 - intervals
                count: 1,
                format: "dd/mm/YYYY",
                showDate: new Date().getTime(),
                startDate: null,
                maxDate: false,
                clearDate: true,
                closeBySelect: true,
                elements: {
                    inputs: true,
                    inputsDisabled: false,
                },
                showStepsInfo: {
                    enable: false,
                    stepsText: [
                        {id: 1, text: 'Задайте интервал от начала даты до конца'},
                        {id: 2, text: 'Выберите конечные интервал'},
                        {id: 3, text: 'Интервал был задан'}
                    ]
                }
            }, options)

            // set global settings
            resultSettings.settings = settings

            if (resultSettings.settings.view == 0) {
                // start date
                let getDate = Utils.showCalendarDate()

                // set month
                let calendarData = {month: getDate.month, year: getDate.year}

                // set date
                resultSettings.date = calendarData

                // create inputs & calendar
                let createInputs = calendarInit.elements.createInputs()
                let createFullCalendar = calendarInit.createFullDomCalendar()
                let createStepActive = calendarInit.elements.stepActive.createStepActive()

                let getCoords = null, getClass = null, getStyle = null

                if (getTypeTag == 'INPUT') {
                    getClass = `szCalendar__absolute szCalendar__hidded`
                    getStyle = `margin-top: 50px;`
                }

                // result
                let $domFinal = $(`<div class="szCalendar ${getClass}" style="${getStyle}">
                                <div class="szCalendar__row">
                                    <div class="szCalendar__column szCalendar__flex-ac">
                                        ${createInputs.dom}
                                        ${createFullCalendar}
                                        ${createStepActive}
                                    </div>
                                </div>
                            </div>`)


                // APP TO JQUERY
                if (getTypeTag == 'INPUT') {
                    $(this).parent().prepend($domFinal)

                    onLoadInput()

                    $(this).on('input', function (e) {
                        onLoadInput()
                    })

                    function onLoadInput() {
                        if (_self.val().length >= 9) {
                            // date
                            let getDate = Utils.checkAndFormat(_self.val())
                            let defaultDate = Utils.dateSimple(getDate.stampDate)
                            // active item
                            activeItem = defaultDate
                            calendarInit.updateCalendar()

                            // set input
                            _self.val(getDate.stringDate)

                        }
                    }

                    $(this).on('focus', function () {
                        if (stateShowed != 1) {
                            let saveHeight = $(document).innerHeight()

                            // check and show
                            // parse date
                            if($(this).val().length > 0) {
                                console.log("???????")
                                let getDate = Utils.checkAndFormat($(this).val())
                                let defaultDate = Utils.dateSimple(getDate.stampDate)
                                // active item
                                activeItem = defaultDate

                                $(this).val(getDate.stringDate)

                                calendarInit.updateCalendar()
                            }

                            // show
                            $domFinal.show()
                            stateShowed = 1

                            let checkHeightAround = $domFinal.height() + $domFinal.offset().top

                            if(saveHeight < checkHeightAround) {
                                $domFinal.css({
                                    marginTop: `-${$domFinal.height() + 40}px`
                                })
                            } else {
                                $domFinal.css({
                                    marginTop: `50px`
                                })
                            }
                        }
                    })

                    _self.keydown(function (e) {
                        if (e.keyCode == 9) {
                            $domFinal.hide()
                            stateShowed = 0
                        }
                    })

                    $(document).mousedown(function (e) {
                        var div = $domFinal, input = _self
                        if ((!div.is(e.target)
                            && div.has(e.target).length === 0) && !input.is(e.target) && input.has(e.target).length == 0) { // и не по его дочерним элементам
                            $domFinal.hide()
                            stateShowed = 0
                        }
                    })
                } else {
                    $(this).html($domFinal)
                }

                // update global settings
                resultSettings.dom = $domFinal

                // init calendars
                calendarInit.setUp()
                createInputs.setUpEvent()
                calendarInit.elements.onClear()
            } else {
                // time
                let getClass = `szCalendar__absolute szCalendar__hidded`

                let getStyle = `margin-top: 50px; width: 200px;`

                let $domFinal = $(`<div class="szCalendar ${getClass}" style="${getStyle}">
                                <div class="szCalendar__row">
                                    <div class="szCalendar__column szCalendar__flex-ac">
                                        <div class="szCalendar__row szCalendar__flex szCalendar__flex-sb szCalendar__flex-ac szCalendar__time">
                                            <div class="szCalendar__time-button" data-event="hour" data-time-type="up">${Utils.getIcon().time.up}</div>
                                            <div></div>
                                            <div class="szCalendar__time-button" data-event="minutes" data-time-type="up">${Utils.getIcon().time.up}</div>
                                        </div>
                                        <div class="szCalendar__row szCalendar__flex szCalendar__flex-sb szCalendar__flex-ac szCalendar__time">
                                            <div><input type="number" data-input="hours" maxlength="2"></div>
                                            <div class="szCalendar__time-double">${Utils.getIcon().time.double}</div>
                                            <div><input type="number" data-input="minutes" maxlength="2"></div>
                                        </div>
                                        <div class="szCalendar__row szCalendar__flex szCalendar__flex-sb szCalendar__flex-ac szCalendar__time">
                                            <div class="szCalendar__time-button" data-event="hour" data-time-type="down">${Utils.getIcon().time.down}</div>
                                            <div></div>
                                            <div class="szCalendar__time-button" data-event="minutes" data-time-type="down">${Utils.getIcon().time.down}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`)

                if (getTypeTag == 'INPUT') {
                    $(this).parent().prepend($domFinal)

                    resultSettings.dom = $domFinal

                    calendarInit.time.onChangeTime()
                    calendarInit.time.onUpdateInput()

                    onLoadInput()

                    $(this).on('input', function (e) {
                        onLoadInput()
                    })

                    function onLoadInput() {
                        if (_self.val().length >= 5) {
                            // get input
                            let getInput = _self.val().split(':').map(Number)

                            if(getInput.length > 0) {
                                if(getInput[0] > 23) {
                                    activeTime.hours = 0
                                } else {
                                    activeTime.hours = getInput[0]
                                }

                                if(getInput[1] > 59) {
                                    activeTime.minutes = 0
                                } else {
                                    activeTime.minutes = getInput[1]
                                }

                            } else {
                                activeTime.hours = 0
                                activeTime.minutes = 0
                            }

                            // set input
                            _self.val(`${calendarInit.time.onFormatInput().hours}:${calendarInit.time.onFormatInput().minutes}`)
                            calendarInit.time.setUpTime()

                        }
                    }

                    $(this).on('focus', function () {
                        if (stateShowed != 1) {
                            // set up time
                            calendarInit.time.setUpTime()

                            let saveHeight = $(document).innerHeight()

                            // show
                            $domFinal.show()
                            stateShowed = 1

                            let checkHeightAround = $domFinal.height() + $domFinal.offset().top

                            if(saveHeight < checkHeightAround) {
                                $domFinal.css({
                                    marginTop: `-${$domFinal.height() + 40}px`
                                })
                            } else {
                                $domFinal.css({
                                    marginTop: `50px`
                                })
                            }
                        }
                    })

                    _self.keydown(function (e) {
                        if (e.keyCode == 9) {
                            $domFinal.hide()
                            stateShowed = 0
                        }
                    })

                    $(document).mousedown(function (e) {
                        var div = $domFinal, input = _self
                        if ((!div.is(e.target)
                            && div.has(e.target).length === 0) && !input.is(e.target) && input.has(e.target).length == 0) { // и не по его дочерним элементам
                            $domFinal.hide()
                            stateShowed = 0
                        }
                    })
                }
            }

        },
        resultDate: function() {
            return this.data('getData')
        }
    }

    /**
     * INIT METHODS JQUERY COMPONENT
     * @param method
     * @returns {void|*}
     */
    $.fn.szCalendar = function(method) {
        if (methods[method]) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод с именем ' +  method + ' не существует для szCalendar' );
        }
    }
})($)