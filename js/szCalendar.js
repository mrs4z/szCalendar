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
        }
    }

    // init solo selector
    var soloCreate = new calendarSelector.solo()

    /**
     * methods
     */
    var methods = {
        init: function(options) {
            let _self = $(this)

            // default settings
            var settings = $.extend({
                method: 'solo',
                startDate: {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                    day: null
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
            let selectedDate = soloCreate

            // create table
            let $tableTemplate = $(`
                <div class="debug">
                    <div class="szCalendar">
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
                    <div style="margin-left: 50px; margin-top: 20px;">
                        <div>Выбранная дата: <span style="font-weight: bold;" debug-object="selected-date"></span></div>
                        <div>Выбранная дата (TIMESTAMP): <span style="font-weight: bold;" debug-object="selected-date-timestamp"></span></div>
                    </div>
                </div>
            `)

            // app to html
            _self.html($tableTemplate)

            loadCalendar(defaultMonth)

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

            function loadCalendar(getMonth) {
                fullLoaderCalendar(getMonth)
                fullLoaderCalendar(getMonth + 1 == 12 ? 0 : getMonth + 1, "two")
            }

            function fullLoaderCalendar(newMonth, dom = "one") {
                let documentCreate = $(document.createDocumentFragment())
                // month
                let month = newMonth

                // get date
                let date = new Date(staticYear, month)
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
                    let $createItem = $(`<td ${saveDate == toDay && month == currentMonth && staticYear == currentYear ? 'class="szCalendar-today"' : ""}>${saveDate}</td>`)

                    /**
                     * for solo method date fetch
                     */
                    if(settings.method == 'solo') {
                        if (selectedDate.getSelectedDate().dom != null) {
                            if (selectedDate.getSelectedDate().date.year == staticYear && selectedDate.getSelectedDate().date.month == month && selectedDate.getSelectedDate().date.day == saveDate) {
                                $createItem.addClass('szCalendar-selected')
                                selectedDate.set.setDom($createItem)
                            }
                        } else {
                            if (settings.startDate.day != null) {
                                if (settings.startDate.day == saveDate) {
                                    selectedDate.setSelectedDate({
                                        dom: $createItem,
                                        date: {
                                            year: staticYear,
                                            month: staticMonth,
                                            day: saveDate
                                        }
                                    })

                                    // add class
                                    selectedDate.getSelectedDate().dom.addClass('szCalendar-selected')
                                }
                            }
                        }
                    }

                    // app to table
                    documentCreate.append($createItem)

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
                                    year: staticYear,
                                    month: month,
                                    day: saveDate
                                }
                            })

                            // add class
                            selectedDate.getSelectedDate().dom.addClass('szCalendar-selected')

                            // for debug change
                            $tableTemplate.find('[debug-object="selected-date"]').html(new Date(selectedDate.getSelectedDate().date.timestamp).getFullYear())
                            $tableTemplate.find('[debug-object="selected-date-timestamp"]').html(selectedDate.getSelectedDate().date.timestamp)
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
            return soloCreate.getSelectedDate().date
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