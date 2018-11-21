

function radians(deg){
	//rad = deg * pi/180
	return deg * (Math.PI/180);
}

function degrees(rad) {
	//rad = deg * pi/180
	return rad / (Math.PI/180);
}


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}