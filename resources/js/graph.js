let storedata = JSON.parse(document.getElementById('storedata').textContent);
let storename = document.getElementById('storename').textContent;
let storestate = document.getElementById('storestate').textContent;
let username = document.getElementById('username').textContent;
let apikey = document.getElementById('apikey').textContent;


TESTER = document.getElementById('tester');

let dates = [];
let commute = [];

for (i = 1; i < storedata.length; i++) {
	dates.push(storedata[i].date);
	commute.push(storedata[i].commute);
}

Plotly.newPlot( TESTER, [{
	x: dates,
	y: commute }], {
	margin: { t: 0 } 
});