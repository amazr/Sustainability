let storedata = JSON.parse(document.getElementById('storedata').textContent);
let storename = document.getElementById('storename').textContent;
let storestate = document.getElementById('storestate').textContent;
let username = document.getElementById('username').textContent;
let apikey = document.getElementById('apikey').textContent;


g1 = document.getElementById('g1');
g2 = document.getElementById('g2');
g3 = document.getElementById('g3');
g4 = document.getElementById('g4');

let dates = [];
let trash = [];
let recycle = [];
let compost = [];
let coffee = [];
let electric = [];
let water = [];
let cvw = [];


for (i = 1; i < storedata.length; i++) {
	dates.push(storedata[i].date);
	water.push(parseInt(storedata[i].water));
	electric.push(parseInt(storedata[i].electric));
	trash.push(parseInt(storedata[i].trash) * 100 / (parseInt(storedata[i].trash) + parseInt(storedata[i].recycle) + parseInt(storedata[i].Compost)));
	recycle.push(parseInt(storedata[i].recycle) * 100 / (parseInt(storedata[i].trash) + parseInt(storedata[i].recycle) + parseInt(storedata[i].Compost)));
	compost.push(parseInt(storedata[i].Compost) * 100 / (parseInt(storedata[i].trash) + parseInt(storedata[i].recycle) + parseInt(storedata[i].Compost)));
	cvw.push(parseInt(storedata[i].water) / parseInt(storedata[i].coffee))
}

let gas = parseInt(storedata[storedata.length-1].gas) * 11.66;
let lastElectric = parseInt(storedata[storedata.length-1].electric) * 0.95;
let commute = parseInt(storedata[storedata.length-1].commute) * 0.9;
let lastCoffee = parseInt(storedata[storedata.length-1].coffee) * 11;
let milk = parseInt(storedata[storedata.length-1].milk) * 7;

var percentTrash = {
x: dates,
y: trash,
mode: 'lines+markers',
name: 'trash'
};

var percentRecycle = {
x: dates,
y: recycle,
mode: 'lines+markers',
name: 'recycle'
};

var percentCompost = {
x: dates,
y: compost,
mode: 'lines+markers',
name: 'compost'
};

var label1 = {
title: 'Percentage of Different Types of Waste',
xaxis: {
title: 'Date'
},
yaxis:{
title: 'Percentage'
}
};

var data1 = [percentTrash, percentCompost, percentRecycle];

Plotly.newPlot(g1, data1, label1);

var electric2 = {
x: dates,
y: electric,
mode: 'lines+markers',
name: 'Electricity (kW Hours)'
};

var label2 = {
title: 'Electric bill',
xaxis: {
title: 'Date'
},
yaxis:{
title: 'kilowatt hours'
}
};

Plotly.newPlot(g2, [electric2], label2);

var data3 = [{
values: [gas, lastElectric, commute, lastCoffee, milk],
labels: ['gas', 'electric', 'commute', 'coffee', 'milk'],
type: 'pie'
}]

var layout3 = {
title: 'Where are those carbon dioxide emmissions coming from?',
height: 50,
width: 700,
};

Plotly.newPlot(g3, data3, layout3);

var waterVscoffee = {
x: dates,
y: cvw,
mode: 'lines+markers',
};


var label4 = {
title: 'Water effeciency',
xaxis: {
title: 'Date'
},
yaxis:{
title: 'Gallons of water per Pound of coffee'
}
};

Plotly.newPlot(g4, [waterVscoffee], label4);