let storedata = JSON.parse(document.getElementById('storedata').textContent);
let storename = document.getElementById('storename').textContent;
let storestate = document.getElementById('storestate').textContent;
let username = document.getElementById('username').textContent;
let apikey = document.getElementById('apikey').textContent;


TESTER = document.getElementById('tester');
Plotly.newPlot( TESTER, [{
	x: [1, 2, 3, 4, 5],
	y: [1, 2, 4, 8, 16] }], {
    margin: { t: 0 } 
});