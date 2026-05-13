async function loadCSV() {
  const response = await fetch("incidence_intensity_poverty_2021_forGHP.csv");
  const text = await response.text();

  const rows = text.trim().split("\n");
  rows.shift(); // remove header

  return rows.map(row => {
    const cols = row.split(",");

    return {
      series: cols[0],
      x: parseFloat(cols[1]),
      y: parseFloat(cols[2]),
      z: parseFloat(cols[3]),
      color: cols[4]
    };
  });
}

async function drawChart() {
  const rawData = await loadCSV();

  const series = rawData.map(d => {
    const cleanColor = d.color
      .replace(/\r/g, "")
      .replace(/"/g, "")
      .trim();

    return {
      name: d.series, // this becomes legend label
      data: [{
        x: d.x,
        y: d.y,
        z: d.z
      }],
      color: cleanColor
    };
  });

  
  Highcharts.chart("container", {
    chart: {
       type: 'bubble',
        plotBorderWidth: 1,
        zoomType: "xy"
    },

    title: {
      text: "Incidence and Intensity of Poverty, 2021"
    },

    subtitle: {
        text: 'Source: Census Bureaus American Community Survey One-Year Public Use Micorodata, as augmented by NYC Opportunity'
    },


    legend: {
        enabled: true
    },

     xAxis: {
        gridLineWidth: 1,
        title: {
            text: 'Poverty Rate'
        },
        labels: {
            format: '{value}%'
        },
        plotLines: [{
            dashStyle: 'dot',
            width: 2,
            value: 13.4,
            label: {
                rotation: 0,
                y: .5,
                style: {
                    fontStyle: 'italic'
                },
                text: 'Citywide Poverty (13.4%)'
            },
            zIndex: 3
        }]
    },

    yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
            text: 'Intensity of Poverty'
        },
        labels: {
            format: '{value}'
        },
        maxPadding: .1,
        plotLines: [{
            dashStyle: 'dot',
            width: 2,
            value: 38.2,
            label: {
                align: 'right',
                style: {
                    fontStyle: 'italic'
                },
                text: 'Citywide Intensity (38.2)',
                x: -.5
            },
            zIndex: 3
        }]
    },

    tooltip: {
      useHTML: true,
      pointFormat:
        "<b>{series.name}</b><br/>" +
        "x: {point.x}<br/>" +
        "y: {point.y}<br/>" +
        "z: {point.z}"
    },

    exporting: {
        enabled: true,
        showTable: false // Optionally show table below chart initially
    },

    series: series
  });
}

drawChart();
