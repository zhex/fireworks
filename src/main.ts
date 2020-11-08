import { Particle } from 'particle';
import { Rocket } from './rocket';

const app = document.getElementById('app');
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';
canvas.style.position = 'absolute';
canvas.style.top = '0px';
canvas.style.left = '0px';
canvas.style.cursor = 'pointer';
var context = canvas.getContext('2d')!;

const audio = document.createElement('audio');
app?.appendChild(canvas);

let rockets: Rocket[] = [];
let particles: Particle[] = [];

function launch(e: MouseEvent) {
	if (rockets.length >= 10) {
		return;
	}
	const rocket = new Rocket(e.clientX, window.innerHeight);
	rocket.explosionColor = Math.floor((Math.random() * 360) / 10) * 10;
	rocket.vel.y = Math.random() * -3 - 4;
	rocket.vel.x = Math.random() * 6 - 3;
	rocket.size = 8;
	rocket.shrink = 0.999;
	rocket.gravity = 0.01;
	rockets.push(rocket);
	audio.src = 'fly.wav';
	audio.play();
}

function loop() {
	const existingRockets: Rocket[] = [];
	const existingParticles = [];

	context.fillStyle = `rgba(0, 0, 0, 0.15)`;
	context.fillRect(0, 0, window.innerWidth, window.innerHeight);

	for (const rocket of rockets) {
		rocket.update();
		rocket.render(context);
		const d = Math.sqrt(
			Math.pow(window.innerWidth - rocket.pos.x, 2) +
				Math.pow(window.innerHeight - rocket.pos.y, 2),
		);
		var randomChance =
			rocket.pos.y < (window.innerHeight * 2) / 3
				? Math.random() * 100 <= 1
				: false;

		if (
			rocket.pos.y < window.innerHeight / 5 ||
			rocket.vel.y >= 0 ||
			d < 50 ||
			randomChance
		) {
			const p = rocket.explode();
			particles = particles.concat(...p);
			audio.src = rocket.explosionSound;
			audio.play();
		} else {
			existingRockets.push(rocket);
		}
	}

	rockets = existingRockets;

	for (const p of particles) {
		p.update();

		// render and save particles that can be rendered
		if (p.isExist) {
			p.render(context);
			existingParticles.push(p);
		}
	}

	particles = existingParticles;

	while (particles.length > 800) {
		particles.shift();
	}

	requestAnimationFrame(loop);
}

canvas.addEventListener('click', launch, false);
loop();
