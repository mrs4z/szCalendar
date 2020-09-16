# szCalendar
Calendar Plugin for jQuery

# Функционал плагина:
- Поддержка 2-х типов : solo / multi (опционально)
- Один или 2 календаря на выбор (опционально)
- Предустановленные значения (опционально)
- Присутствуют поля, при выборе даты в них вставляется значение выбранной даты по паттерну, который укажете (опционально)

# Календарь возвращает:
- String дату, по дефолту dd-mm-YYYY
- Дату в timestamp
- year / month / day

# Параметры
* `method` - [INT] принимает значения 0 или 1, где 0 - это одиночный выбор даты, а 1 - это интервальный выбор даты
* `calendarsCount` - [INT] количество календарей для вывода, Максимальное количество - 2
* `setup` - [BOOLEAN] позволяет включить список установленных дат для выбора
* `input` - [BOOLEAN] позволяет включить INPUT(ы) в календаре, в случае если `method` == 0 - будет одно поле, если же `method` == 1, будет 2 поля
* `editable` - [BOOLEAN] позволяет запретить изменять дату. При `input` == true - поля ввода так же блокируются.
* `params` - [Object] параметры для методов:
  * `multi` - [Object] используется для настройки, в случае если `method` == 1
    * `start` - [Object] параметры даты начала интервала
      * `year` - [INT] задать год для начала интервала
      * `month` - [INT] задать месяц для начала интервала (от 1 до 12)
      * `day` - [INT] задать день для начала интервала
    * `end` - [Object] по аналогии с `start`, включает идентичные параметры
    
    
# Методы
* `getFullDate` - вернет объект с данными (в зависимости от выбранного `method`)

# Пример
### HTML
```HTML
<div id="calendar"></div>
```

### JS
```JS
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
```
![example calendar](https://github.com/mrs4z/szCalendar/blob/master/readme/Calendar.png)


