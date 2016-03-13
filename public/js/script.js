document.getElementById('addItem').addEventListener(click, function(event) {
	var req = new XMLHttpRequest();
	var payload = {
		name: null,
		reps: null,
		weight: null,
		weight: null,
		date: null,
		lbs: null
	};
	payload.name = document.getElementById('name').value;
	payload.reps = document.getElementById('reps').value;
	payload.reps = document.getElementById('weight').value;
	payload.reps = document.getElementById('date').value;
	payload.reps = document.getElementById('lbs').value;

	req.open('POST', 'http://localhost:3000', false);
	req.send(JSON.stringify(payload));
	var response = JSON.parse(req.responseText);
});