(function($ ){

    /**
     * CALENDAR SELECTOR METHODS
     */
    var calendarSelector = {
        solo: function() {
            let selectedDate = {
                dom: null,
                date: {
                    year: 0,
                    month: 0,
                    day: 0,
                    full: "",
                    timestamp: 0
                }
            }

            return {
                // selected date func result
                getSelectedDate: function() {
                    return selectedDate
                },
                setSelectedDate: function(params) {
                    selectedDate.dom = params.dom || null
                    selectedDate.date.year = params.date.year || 0
                    selectedDate.date.month = params.date.month || 0
                    selectedDate.date.day = params.date.day || 0

                    selectedDate.date.full = `${selectedDate.date.year}-${selectedDate.date.month + 1}-${selectedDate.date.day}`
                    selectedDate.date.timestamp = new Date(selectedDate.date.year, selectedDate.date.month, selectedDate.date.day).getTime()
                },
                set: {
                    setDom: function(dom) { selectedDate.dom = dom },
                    setYear: function(year) { selectedDate.date.year = year },
                    setMonth: function(month) { selectedDate.date.month = month },
                    setDay: function(day) { selectedDate.date.day = day }
                }
            }
        },
        multi: function() {
            let selectedDateMulti = {
                firstSettings: false,
                dom: {
                    start: null,
                    end: null
                },
                date: {
                    start: {
                        year: 0,
                        month: 0,
                        day: 0,
                        full: "",
                        timestamp: 0
                    }, end: {
                        year: 0,
                        month: 0,
                        day: 0,
                        full: "",
                        timestamp: 0
                    }
                }
            }

            // state
            let stateSelected = false

            return {
                clearSelector: function(dom) {
                    this.clearSelectorItem('start', dom)
                    this.clearSelectorItem('end', dom)

                    // clear selected block
                    this.clearRangeDom(dom)
                },
                clearSelectorItem: function(type, dom) {
                    if(selectedDateMulti['dom'][type] != null) {
                        selectedDateMulti['dom'][type].removeClass('szCalendar-selected')
                        selectedDateMulti['dom'][type] = null
                    }

                    this.clearRangeDom(dom)
                },
                clearRangeDom: function(dom) {
                    $.each(dom.find('.szCalendar-interval-selected'), function(index, item) {
                        $(item).removeClass('szCalendar-interval-selected')
                    })
                },
                setActiveDom: function(type) {
                    selectedDateMulti['dom'][type].addClass('szCalendar-selected')
                },
                isSelected: function() {
                    return stateSelected == true
                },
                setStateSelected: function(state) {
                    stateSelected = state
                },
                // selected date func result
                getSelectedDate: function() {
                    return selectedDateMulti
                },
                setSelectedDate: function(params) {

                    selectedDateMulti.date.full = `${selectedDateMulti.date.year}-${selectedDateMulti.date.month + 1}-${selectedDateMulti.date.day}`
                    selectedDateMulti.date.timestamp = new Date(selectedDateMulti.date.year, selectedDateMulti.date.month, selectedDateMulti.date.day).getTime()
                },
                set: {
                    setStartDom: function(dom) { selectedDateMulti.dom.start = dom },
                    setEndDom: function(dom) { selectedDateMulti.dom.end = dom },
                    setDom: function(dom, type) { selectedDateMulti['dom'][type] = dom },
                    setDay: function(day, type) { selectedDateMulti['date'][type]['day'] = day },
                    setYear: function(year, type) { selectedDateMulti['date'][type]['year'] = year },
                    setMonth: function(month, type) { selectedDateMulti['date'][type]['month'] = month },
                    setFullDate: function(year, month, day, type) {
                        // check date
                        let currentDate = new Date()

                        if(year < 1900) {
                            year = currentDate.getFullYear()
                        }

                        if(month < 0 || month > 11) {
                            month = currentDate.getMonth()
                        }

                        let checkDaysByDate = new Date(year, month + 1, 0)

                        if(day < 1 || day > checkDaysByDate.getDate()) {
                            day = 1
                        }

                        this.setDay(day, type)
                        this.setMonth(month, type)
                        this.setYear(year, type)

                        this.createFullAndTimestamp({ year: year, month: month, day: day }, type)
                    },
                    createFullAndTimestamp:  function(params, type) {
                        selectedDateMulti['date'][type]['full'] = `${params.year}-${params.month + 1}-${params.day}`
                        selectedDateMulti['date'][type]['timestamp'] = new Date(params.year, params.month, params.day).getTime()
                    }
                }, setup: {
                    toDay: function() {
                        // create to day
                        let toDay = new Date()
                        let resultDate = this.formatterDate(toDay.getFullYear(), toDay.getMonth() + 1, toDay.getDate())

                        return {
                            start: resultDate,
                            end: resultDate
                        }
                    }, yestDay: function() {
                        // create yest day
                        let toDay = new Date()
                        toDay.setDate(toDay.getDate() - 1)
                        let resultDate = this.formatterDate(toDay.getFullYear(), toDay.getMonth() + 1, toDay.getDate())

                        return {
                            start: resultDate,
                            end: resultDate
                        }
                    }, lastSevenDay: function() {
                        // create yest day
                        let toDay = new Date()
                        let sevenDay = new Date()

                        sevenDay.setDate(toDay.getDate() - 7)

                        let resultToday = this.formatterDate(toDay.getFullYear(), toDay.getMonth() + 1, toDay.getDate())
                        let resultSevenDay = this.formatterDate(sevenDay.getFullYear(), sevenDay.getMonth() + 1, sevenDay.getDate())

                        return {
                            start: resultSevenDay,
                            end: resultToday
                        }
                    }, onThisWeek: function() {
                        // create yest day
                        let toDay = new Date()

                        // create on this week
                        let dateOnWeek = new Date()

                        // set date to day
                        dateOnWeek.setDate(toDay.getDate() - toDay.getDay() + 1)

                        let resultOnWeek = this.formatterDate(dateOnWeek.getFullYear(), dateOnWeek.getMonth() + 1, dateOnWeek.getDate())
                        let resultToDay = this.formatterDate(toDay.getFullYear(), toDay.getMonth() + 1, toDay.getDate())

                        return {
                            start: resultOnWeek,
                            end: resultToDay
                        }
                    }, onPastWeek: function() {
                        // create yest day
                        let toDay = new Date()

                        // create on this week
                        let dateOnWeek = new Date()

                        // set date to day
                        dateOnWeek.setDate(toDay.getDate() - toDay.getDay() - 6)
                        toDay.setDate(toDay.getDate() - toDay.getDay())

                        let resultOnWeek = this.formatterDate(dateOnWeek.getFullYear(), dateOnWeek.getMonth() + 1, dateOnWeek.getDate())
                        let resultToDay = this.formatterDate(toDay.getFullYear(), toDay.getMonth() + 1, toDay.getDate())

                        return {
                            start: resultOnWeek,
                            end: resultToDay
                        }
                    }, onThisMonth: function() {
                        // create yest day
                        let toDay = new Date()
                        let startMonth = new Date()

                        startMonth.setDate(1)

                        let resultStartMonth = this.formatterDate(startMonth.getFullYear(), startMonth.getMonth() + 1, startMonth.getDate())
                        let resultToDay = this.formatterDate(toDay.getFullYear(), toDay.getMonth() + 1, toDay.getDate())

                        return {
                            start: resultStartMonth,
                            end: resultToDay
                        }
                    }, onPastMonth: function() {
                        // create yest day
                        let startMonth = new Date()
                        let endMonth = new Date()

                        // for count days in month
                        let countDays = new Date(startMonth.getFullYear(), startMonth.getMonth() - 1, 0).getDate()

                        startMonth.setMonth(startMonth.getMonth() - 1)
                        startMonth.setDate(1)

                        endMonth.setMonth(endMonth.getMonth() - 1)
                        endMonth.setDate(countDays)

                        let resultStartMonth = this.formatterDate(startMonth.getFullYear(), startMonth.getMonth() + 1, startMonth.getDate())
                        let resultEndMonth = this.formatterDate(endMonth.getFullYear(), endMonth.getMonth() + 1, endMonth.getDate())

                        return {
                            start: resultStartMonth,
                            end: resultEndMonth
                        }
                    }, onThisYear: function() {
                        // create yest day
                        let startYear = new Date()
                        let toDay = new Date()

                        // for count days in month
                        startYear.setFullYear(toDay.getFullYear())
                        startYear.setMonth(0)
                        startYear.setDate(1)

                        let resultStartYear = this.formatterDate(startYear.getFullYear(), startYear.getMonth() + 1, startYear.getDate())
                        let resultToDay = this.formatterDate(toDay.getFullYear(), toDay.getMonth() + 1, toDay.getDate())

                        return {
                            start: resultStartYear,
                            end: resultToDay
                        }
                    },
                    formatterDate: function(year, month, date) {
                        return `${year}-${month}-${date}`
                    },
                }
            }
        }
    }

    // init solo selector
    var soloCreate = new calendarSelector.solo()
    var multiCreate = new calendarSelector.multi()

    /**
     * methods
     */
    var methods = {
        init: function(options) {
            let _self = $(this)

            // default settings
            var settings = $.extend({
                method: 'solo',
                calendarsCount: 2,
                startDate: {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                    day: null
                },
                // for multi
                params: {
                    multi: {
                        start: {
                            year: new Date().getFullYear(),
                            month: new Date().getMonth() + 1,
                            day: new Date().getDate()
                        }, end: {
                            year: new Date().getFullYear(),
                            month: new Date().getMonth() + 1,
                            day: new Date().getDate()
                        }
                    }
                }
            }, options)

            // months array
            let monthsArray = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]

            // default to day month & year
            let defaultYear = settings.startDate.year
            let defaultMonth = settings.startDate.month - 1

            // to day params
            let currentYear = new Date().getFullYear()
            let currentMonth = new Date().getMonth()

            // on change static params
            let staticMonth = defaultMonth
            let staticYear = defaultYear

            // selected date
            let selectedDate = settings.method == 'solo' ? soloCreate : multiCreate

            // create table
            let $tableTemplate = $(`
                <div class="debug">
                    <div class="szCalendar">
                        <div class="szCalendar__multi">
                            <div class="szCalendar__multi-setup">
                                <a>За все время</a>
                                <a calendar-object="setup" calendar-setup-type="toDay">Сегодня</a>
                                <a calendar-object="setup" calendar-setup-type="yestDay">Вчера</a>
                                <a calendar-object="setup" calendar-setup-type="lastSevenDay">За последние 7 дней</a>
                                <a calendar-object="setup" calendar-setup-type="onThisWeek">На этой неделе</a>
                                <a calendar-object="setup" calendar-setup-type="onPastWeek">Прошлая неделя</a>
                                <a calendar-object="setup" calendar-setup-type="onThisMonth">В этом месяце</a>
                                <a calendar-object="setup" calendar-setup-type="onPastMonth">Прошлый месяц</a>
                                <a calendar-object="setup" calendar-setup-type="onThisYear">За текущий год</a>
                            </div>
                            <div class="szCalendar__multi-form">
                                <div class="szCalendar__multi-form-inputs">
                                    <div class="szCalendar__multi-form-inputs-title">Диапазон:</div>
                                    <div><input type="text" calendar-object="multi-start-date"></div>
                                    <div>&mdash;</div>
                                    <div><input type="text" calendar-object="multi-end-date"></div>
                                </div>
                                <div class="szCalendar__body">
                                    <div class="szCalendar__body-item">
                                        <div class="szCalendar__body-item-menu">
                                            <div class="szCalendar__body-item-menu-button" calendar-object="prev"><</div>
                                            <div class="szCalendar__body-item-menu-button" calendar-object="title">${monthsArray[staticMonth]} ${staticYear}</div>
                                        </div>
                                        <div>
                                            <table class="szCalendar__table">
                                                <thead>
                                                    <th>пн</th>
                                                    <th>вт</th>
                                                    <th>ср</th>
                                                    <th>чт</th>
                                                    <th>пт</th>
                                                    <th>сб</th>
                                                    <th>вс</th>
                                                </thead>
                                                <tbody calendar-object="body-one">
                                                </tbody>
                                            </table>
                                       </div>
                                    </div>
                                    <div class="szCalendar__body-item">
                                        <div class="szCalendar__body-item-menu">
                                            <div class="szCalendar__body-item-menu-button" calendar-object="title-two">${monthsArray[staticMonth + 1]} ${staticYear}</div>
                                            <div class="szCalendar__body-item-menu-button" calendar-object="next">></div>
                                        </div>
                                        <div>
                                            <table class="szCalendar__table">
                                                <thead>
                                                    <th>пн</th>
                                                    <th>вт</th>
                                                    <th>ср</th>
                                                    <th>чт</th>
                                                    <th>пт</th>
                                                    <th>сб</th>
                                                    <th>вс</th>
                                                </thead>
                                                <tbody calendar-object="body-two">
                                                </tbody>
                                            </table>
                                       </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)

            // app to html
            _self.html($tableTemplate)

            /**
             * events for multi
             */
            if(settings.method == 'multi') {

                // first settings
                selectedDate.firstSettings = true

                // on load default params
                selectedDate.set.setFullDate(settings.params.multi.start.year, settings.params.multi.start.month - 1, settings.params.multi.start.day, 'start')
                selectedDate.set.setFullDate(settings.params.multi.end.year, settings.params.multi.end.month - 1, settings.params.multi.end.day, 'end')

                // update values inputs by settings
                $tableTemplate.find('[calendar-object="multi-start-date"]').val(selectedDate.getSelectedDate().date.start.full)
                $tableTemplate.find('[calendar-object="multi-end-date"]').val(selectedDate.getSelectedDate().date.end.full)

                $tableTemplate.find('[calendar-object="multi-start-date"]').on('change', function() {
                    updateByType($(this).val(), 'start', 1)

                    // update real data
                    $(this).val(selectedDate.getSelectedDate().date.start.full)
                })

                $tableTemplate.find('[calendar-object="multi-end-date"]').on('change', function() {
                    updateByType($(this).val(), 'end', 1)

                    // update real data
                    $(this).val(selectedDate.getSelectedDate().date.end.full)
                })

                $tableTemplate.find('[calendar-object="setup"]').click(function() {
                    // get param
                    let getType = $(this).attr('calendar-setup-type')
                    let getParamsOfData = selectedDate.setup[getType]()

                    console.log(getParamsOfData)

                    updateByType(getParamsOfData.start, 'start')
                    updateByType(getParamsOfData.end, 'end')

                    $tableTemplate.find('[calendar-object="multi-start-date"]').val(getParamsOfData.start)
                    $tableTemplate.find('[calendar-object="multi-end-date"]').val(getParamsOfData.end)
                })

                function updateByType(value, type, updateType = 0) {
                    selectedDate.clearSelectorItem(type, $tableTemplate)

                    // parse value
                    let parseValue = value.split("-")

                    if(updateType != 0) {
                        let resultParseDate = type == "end" ? "start" : "end"
                        let parseValueReverse = $tableTemplate.find(`[calendar-object="multi-${resultParseDate}-date"]`).val().split('-')

                        let getCompare = type == "end" ? (parseInt(parseValue[0]) <= parseInt(parseValueReverse[0])) && (parseInt(parseValue[1]) <= parseInt(parseValueReverse[1])) && (parseInt(parseValue[2]) <= parseInt(parseValueReverse[2]))
                            : (parseInt(parseValue[0]) >= parseInt(parseValueReverse[0])) && (parseInt(parseValue[1]) >= parseInt(parseValueReverse[1])) && (parseInt(parseValue[2]) >= parseInt(parseValueReverse[2]))

                        if (getCompare) {
                            parseValue = parseValueReverse
                        }
                    }

                    selectedDate.set.setFullDate(parseInt(parseValue[0]), parseInt(parseValue[1]) - 1, parseInt(parseValue[2]), type)
                    selectedDate.set.setDom($tableTemplate.find(`[data-object="${selectedDate.getSelectedDate()['date'][type]['year']}-${selectedDate.getSelectedDate()['date'][type]['month'] - 1}-${selectedDate.getSelectedDate()['date'][type]['day']}"]`), type)

                    updateMultiSelect()
                }
            }

            loadCalendar(defaultMonth)

            /**
             * event change calendar prev
             */
            $tableTemplate.find('[calendar-object="prev"]').click(function() {
                let onChangeStaticMonth = staticMonth - 1

                if(onChangeStaticMonth < 0) {
                    staticMonth = 11
                    staticYear--
                } else {
                    staticMonth = onChangeStaticMonth
                }

                loadCalendar(staticMonth)
                onChangeTitle(staticMonth)
            })

            /**
             * event change calendar next
             */
            $tableTemplate.find('[calendar-object="next"]').click(function() {
                let onChangeStaticMonth = staticMonth + 1

                if(onChangeStaticMonth == 12) {
                    staticMonth = 0
                    staticYear++
                } else {
                    staticMonth = onChangeStaticMonth
                }

                loadCalendar(staticMonth)
                onChangeTitle(staticMonth)
            })

            /**
             * change title's
             * @param month
             */
            function onChangeTitle(month) {
                let monthForNext = month + 1, yearForNext = staticYear

                if(monthForNext + 1 == 13) {
                    monthForNext = 0
                    yearForNext++
                }

                $tableTemplate.find('[calendar-object="title"]').html(monthsArray[month] + " " + staticYear)
                $tableTemplate.find('[calendar-object="title-two"]').html(monthsArray[monthForNext] + " " + yearForNext)
                staticMonth = month
            }


            /**
             * load calendar
             * TODO: make solo calendar version
             * @param getMonth
             */
            function loadCalendar(getMonth) {
                fullLoaderCalendar(getMonth, staticYear)

                if(settings.calendarsCount == 2) {
                    fullLoaderCalendar(getMonth + 1 == 12 ? 0 : getMonth + 1, getMonth + 1 == 12 ? staticYear + 1 : staticYear, "two")
                }

                if (settings.method == 'multi') {
                    updateMultiSelect()
                }
            }

            /**
             * for multi-selector
             * @returns {boolean}
             */
            function updateMultiSelect() {
                /**
                 * for multi
                 */
                // check selectors date
                if(!selectedDate.firstSettings) {
                    if ((selectedDate.getSelectedDate().dom.start == null) && (selectedDate.getSelectedDate().dom.end == null)) {
                        selectedDate.clearSelector($tableTemplate)
                        return false;
                    }
                }

                if(selectedDate.getSelectedDate().dom.start != null || selectedDate.firstSettings)
                    $tableTemplate.find(`[data-object="${selectedDate.getSelectedDate().date.start.year}-${selectedDate.getSelectedDate().date.start.month}-${selectedDate.getSelectedDate().date.start.day}"]`).addClass('szCalendar-selected')

                if(selectedDate.getSelectedDate().dom.end != null || selectedDate.firstSettings)
                    $tableTemplate.find(`[data-object="${selectedDate.getSelectedDate().date.end.year}-${selectedDate.getSelectedDate().date.end.month}-${selectedDate.getSelectedDate().date.end.day}"]`).addClass('szCalendar-selected')

                selectedDate.firstSettings = true

                selectedDate.set.setStartDom($tableTemplate.find(`[data-object="${selectedDate.getSelectedDate().date.start.year}-${selectedDate.getSelectedDate().date.start.month}-${selectedDate.getSelectedDate().date.start.day}"]`))
                selectedDate.set.setEndDom($tableTemplate.find(`[data-object="${selectedDate.getSelectedDate().date.end.year}-${selectedDate.getSelectedDate().date.end.month}-${selectedDate.getSelectedDate().date.end.day}"]`))


                let getStartDate = {
                    year: selectedDate.getSelectedDate().date.start.year,
                    month: selectedDate.getSelectedDate().date.start.month,
                    day: selectedDate.getSelectedDate().date.start.day
                }

                let getHoverDate = {
                    year: selectedDate.getSelectedDate().date.end.year,
                    month: selectedDate.getSelectedDate().date.end.month,
                    day: selectedDate.getSelectedDate().date.end.day
                }

                // get year
                for(let formYear = getStartDate.year; formYear <= getHoverDate.year; formYear++) {
                    console.log(`year -> ${getStartDate.year} / new year -> ${formYear}`)
                    let startMonth = getStartDate.month
                    let getEndMonth = getHoverDate.month

                    if(startMonth == 11) {
                        getEndMonth = 11
                    }

                    // check form
                    if(getStartDate.year != formYear) {
                        startMonth = 0
                        getEndMonth = getHoverDate.month
                    }

                    for(let formMonth = startMonth; formMonth <= getEndMonth; formMonth++) {
                        let startDay = startMonth == 0 ? 0 : getStartDate.day
                        let endDay = getHoverDate.day

                        console.log(`ДОЛЖНО БЫТЬ 2 РАЗА ->`, formYear)

                        if (startMonth < getHoverDate.month) {
                            if(formMonth != getStartDate.month && formMonth != getHoverDate.month) {
                                startDay = 0
                                endDay = 32
                            } else if (formMonth != getStartDate.month) {
                                startDay = 0
                                endDay = getHoverDate.day
                            } else {
                                startDay = getStartDate.day
                                endDay = 32
                            }
                        } else {
                            if(formMonth == 11) {
                                endDay = 32
                            }
                        }

                        // get day
                        for(let formDay = startDay; formDay < endDay; formDay++) {
                            $tableTemplate.find(`[data-object="${formYear}-${formMonth}-${formDay}"]`).addClass('szCalendar-interval-selected')
                        }
                    }
                }
            }

            /**
             * main load
             * @param newMonth
             * @param newYear
             * @param dom
             */
            function fullLoaderCalendar(newMonth, newYear, dom = "one") {
                let documentCreate = $(document.createDocumentFragment())
                // month
                let month = newMonth

                // get date
                let date = new Date(newYear, month)
                let toDay = new Date().getDate()

                // для пустых дат вначале
                for(let i = 0; i < getDay(date); i++) {
                    if(i == 0) documentCreate.append('<tr>')
                    documentCreate.append(`<td class="szCalendar-no-active"></td>`)
                }

                // выводим сам календарь
                while(date.getMonth() == month) {
                    // save date & create dom
                    let saveDate = date.getDate()
                    let $createItem = $(`<td ${saveDate == toDay && month == currentMonth && newYear == currentYear ? 'class="szCalendar-today"' : ""} data-object="${newYear}-${month}-${saveDate}">${saveDate}</td>`)

                    /**
                     * for solo method date fetch
                     */
                    if(settings.method == 'solo') {
                        if (selectedDate.getSelectedDate().dom != null) {
                            if (selectedDate.getSelectedDate().date.year == newYear && selectedDate.getSelectedDate().date.month == month && selectedDate.getSelectedDate().date.day == saveDate) {
                                $createItem.addClass('szCalendar-selected')
                                selectedDate.set.setDom($createItem)
                            }
                        } else {
                            if (settings.startDate.day != null) {
                                if (settings.startDate.day == saveDate) {
                                    selectedDate.setSelectedDate({
                                        dom: $createItem,
                                        date: {
                                            year: newYear,
                                            month: staticMonth,
                                            day: saveDate
                                        }
                                    })

                                    // add class
                                    selectedDate.getSelectedDate().dom.addClass('szCalendar-selected')
                                }
                            }
                        }
                    } else {

                    }

                    // app to table
                    documentCreate.append($createItem)

                    if(settings.method == 'multi') {
                        $createItem.hover(function() {
                            if(selectedDate.isSelected()) {
                                selectedDate.clearRangeDom($tableTemplate)

                                if(selectedDate.getSelectedDate().date.start.year <= newYear) {

                                    /**
                                     * должен формироваться массив по типу type 2020-10-03, 2020-10-04
                                     * при выборе на желаемый интервал - должна появляться дата - например 2020-11-04
                                     * в таком случае, мы должны создать массив, при том, что в месяце - 28-31 день, а после циклить по датам и выводить
                                     */

                                    // TODO: получать количество дней в месяце
                                    let maxDays = 31

                                    let parseDate = $(this).attr('data-object').split('-')

                                    let getStartDate = { year: selectedDate.getSelectedDate().date.start.year, month: selectedDate.getSelectedDate().date.start.month, day: selectedDate.getSelectedDate().date.start.day }
                                    let getHoverDate = { year: parseInt(parseDate[0]), month: parseInt(parseDate[1]), day: parseInt(parseDate[2]) }

                                    // get year
                                    for(let formYear = getStartDate.year; formYear <= getHoverDate.year; formYear++) {
                                        let startMonth = getStartDate.month
                                        let getEndMonth = getHoverDate.month

                                        if(startMonth == 11) {
                                            getEndMonth = 11
                                        }

                                        // check form
                                        if(getStartDate.year != formYear) {
                                            startMonth = 0
                                            getEndMonth = getHoverDate.month
                                        }


                                        for(let formMonth = startMonth; formMonth <= getEndMonth; formMonth++) {
                                            let startDay = startMonth == 0 ? 0 : getStartDate.day
                                            let endDay = getHoverDate.day

                                            if (startMonth < getHoverDate.month) {
                                                if(formMonth != getStartDate.month && formMonth != getHoverDate.month) {
                                                    startDay = 0
                                                    endDay = 32
                                                } else if (formMonth != getStartDate.month) {
                                                    startDay = 0
                                                    endDay = getHoverDate.day
                                                } else {
                                                    startDay = getStartDate.day
                                                    endDay = 32
                                                }
                                            } else {
                                                if(formMonth == 11) {
                                                    endDay = 32
                                                }
                                            }

                                            // get day
                                            for(let formDay = startDay; formDay < endDay; formDay++) {
                                                $tableTemplate.find(`[data-object="${formYear}-${formMonth}-${formDay}"]`).addClass('szCalendar-interval-selected')
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }

                    $createItem.click(function() {
                        /**
                         * solo method selector event
                         */
                        if(settings.method == 'solo') {
                            if (selectedDate.getSelectedDate().dom != null) {
                                selectedDate.getSelectedDate().dom.removeClass('szCalendar-selected')
                            }

                            // update selected date object
                            selectedDate.setSelectedDate({
                                dom: $(this),
                                date: {
                                    year: newYear,
                                    month: month,
                                    day: saveDate
                                }
                            })

                            // add class
                            selectedDate.getSelectedDate().dom.addClass('szCalendar-selected')

                            // for debug change
                            $tableTemplate.find('[debug-object="selected-date"]').html(new Date(selectedDate.getSelectedDate().date.timestamp).getFullYear())
                            $tableTemplate.find('[debug-object="selected-date-timestamp"]').html(selectedDate.getSelectedDate().date.timestamp)
                        } else {
                            if(!selectedDate.isSelected()) {
                                selectedDate.clearSelector($tableTemplate)
                            }

                            /**
                             * multi method selector event
                             */
                            if(selectedDate.isSelected()) {
                                selectedDate.setStateSelected(false)

                                if((newYear <= selectedDate.getSelectedDate().date.start.year) && (month <= selectedDate.getSelectedDate().date.start.month) && (saveDate <= selectedDate.getSelectedDate().date.start.day)) {
                                    selectedDate.set.setEndDom(selectedDate.getSelectedDate().dom.start)
                                    selectedDate.set.setFullDate(selectedDate.getSelectedDate().date.start.year, selectedDate.getSelectedDate().date.start.month, selectedDate.getSelectedDate().date.start.day, 'end')
                                } else {
                                    selectedDate.set.setEndDom($(this))
                                    selectedDate.set.setFullDate(newYear, month, saveDate, 'end')
                                }
                                selectedDate.getSelectedDate().dom.end.addClass('szCalendar-selected')

                                // update date in input
                                $tableTemplate.find('[calendar-object="multi-end-date"]').val(selectedDate.getSelectedDate().date.end.full)
                                $tableTemplate.find('[calendar-object="multi-end-date"]').focus()

                            } else {
                                // set active state
                                $tableTemplate.find('[calendar-object="multi-start-date"]').focus()

                                selectedDate.setStateSelected(true)

                                selectedDate.set.setStartDom($(this))
                                selectedDate.set.setFullDate(newYear, month, saveDate, 'start')

                                selectedDate.getSelectedDate().dom.start.addClass('szCalendar-selected')

                                // update date in input
                                $tableTemplate.find('[calendar-object="multi-start-date"]').val(selectedDate.getSelectedDate().date.start.full)
                            }
                        }
                    })

                    if(getDay(date) % 7 == 6) {
                        documentCreate.append('</tr><tr>')
                    }

                    // update date
                    date.setDate(date.getDate() + 1);
                }

                // завершение календаря
                if(getDay(date) != 0) {
                    for(let i = getDay(date); i < 7; i++) {
                        if(i == 0) documentCreate.append('<tr>')
                        documentCreate.append(`<td class="szCalendar-no-active"></td>`)
                    }
                }

                function getDay(dd) {
                    let day = dd.getDay();
                    if (day == 0) day = 7; // сделать воскресенье (0) последним днем
                    return day - 1;
                }

                function daysInMonth(month, year) {
                    return new Date(year, month, 0).getDate();
                }

                _self.find(`[calendar-object="body-${dom}"]`).html(documentCreate)
            }
        }, getFullDate: function() {
            return multiCreate.getSelectedDate().date
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