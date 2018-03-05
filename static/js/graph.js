queue()
    .defer(d3.csv, "data/births.csv")
    .await(makeGraphs);

function makeGraphs(error, birthsData) {
    let ndx = crossfilter(birthsData);
    
    birthsData.forEach(function (d) {
        d.births = parseInt(d.births);
        d.day_of_week = parseInt(d.day_of_week);
        d.date_of_month = parseInt(d.date_of_month);
        d.month = parseInt(d.month);
        d.year = parseInt(d.year);
    });
    







// ============================== Chart 1 ==================================

    let day_of_week_dim = ndx.dimension(function(d){
        if (d.day_of_week == 1){
            return "Monday";
        }
        if (d.day_of_week == 2){
            return "Tuesday";
        }
        if (d.day_of_week == 3){
            return "Wednesday";
        }
        if (d.day_of_week == 4){
            return "Thursday";
        }
        if (d.day_of_week == 5){
            return "Friday";
        }
        if (d.day_of_week == 6){
            return "Saturday";
        }
        if (d.day_of_week == 7){
            return "Sunday";
        }
    });
    let total_births_by_week_days = day_of_week_dim.group().reduceSum(dc.pluck('births'));
    
    dc.barChart("#births-by-day-of-week")
        .dimension(day_of_week_dim)
        .group(total_births_by_week_days)
        .transitionDuration(500)
        .margins({left: 70, right: 10, top: 5, bottom: 20})
        .x(d3.scale.ordinal().domain(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]))
        .xUnits(dc.units.ordinal)
        .yAxis().ticks(4);
        
// ============================== END Chart 1 ==============================







// ============================== Chart 2 ==================================

    let month_dim = ndx.dimension(dc.pluck('month'));
    let total_births_by_months = month_dim.group().reduceSum(dc.pluck('births'));
    
    dc.rowChart("#births-by-month")
            .transitionDuration(1500)
            .dimension(month_dim)
            .group(total_births_by_months)
            .xAxis().ticks(4);

// ============================== END Chart 2 ==============================







// ============================== Chart 3 ==================================
    
    let year_dim = ndx.dimension(dc.pluck('year'));
    let total_births_by_year = year_dim.group().reduceSum(dc.pluck('births'));
    
    let minYear = year_dim.bottom(1)[0].year;
    let maxYear = year_dim.top(1)[0].year;
    
    let chart = dc.lineChart("#births-by-year");
    
        chart
            .dimension(year_dim)
            .group(total_births_by_year)
            .margins({left: 70, right: 10, top: 5, bottom: 20})
            .transitionDuration(500)
            .brushOn(false)
            .x(d3.scale.linear().domain([minYear,maxYear]))
            .yAxis().ticks(4).tickFormat(d3.format("d"));
        chart.xAxis().tickFormat(d3.format("d"));

// ============================== END Chart 3 ==============================








// ============================== Chart 4 ==================================

    let date_of_month_dim = ndx.dimension(dc.pluck('date_of_month'));
    let total_births_by_date_of_month = date_of_month_dim.group().reduceSum(dc.pluck('births'));
    
    console.log(total_births_by_date_of_month.all())
    
    dc.barChart("#births-by-date-of-month")
        .dimension(date_of_month_dim)
        .group(total_births_by_date_of_month)
        .transitionDuration(500)
        .margins({left: 70, right: 10, top: 25, bottom: 20})
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .yAxis().ticks(4);
        
// ============================== END Chart 4 ==============================
    
    dc.renderAll();
}