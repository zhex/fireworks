import { Particle } from './particle';
import { explosions, fly } from './sound';

export class Rocket extends Particle {
	public explosionColor = 0;

	public get explosionSound() {
		const idx = Math.floor(Math.random() * explosions.length);
		return `data:audio/wav;base64,${explosions[idx]}`;
	}

	public get flySound() {
		return `data:audio/wav;base64,${fly}`;
	}

	public explode() {
		const count = Math.floor(Math.random() * 10) + 80;

		const particles = [];

        for (var i = 0; i < count; i++) {
            var particle = new Particle(this.pos.x, this.pos.y);
            var angle = Math.random() * Math.PI * 2;

            // emulate 3D effect by using cosine and put more particles in the middle
            var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

            particle.vel.x = Math.cos(angle) * speed;
            particle.vel.y = Math.sin(angle) * speed;

            particle.size = 10;

            particle.gravity = 0.2;
            particle.resistance = 0.92;
            particle.shrink = Math.random() * 0.05 + 0.93;

            particle.flick = true;
			particle.color = this.explosionColor;
			
			particles.push(particle);
		}
		
		return particles;
	}

	public render(ctx: CanvasRenderingContext2D) {
		if (!this.isExist) {
			return;
		}

		ctx.save();
		ctx.globalCompositeOperation = 'lighter';

		const { x, y } = this.pos;
		const r = this.size / 2;

		var gradient = ctx.createRadialGradient(x, y, 0.1, x, y, r);
		gradient.addColorStop(0.1, `rgba(255, 255, 255, ${this.alpha})`);
		gradient.addColorStop(1, `rgba(0, 0, 0, ${this.alpha})`);
		ctx.fillStyle = gradient;

		ctx.beginPath();
		ctx.arc(
			x,
			y,
			this.flick
				? (Math.random() * this.size) / 2 + this.size / 2
				: this.size,
			0,
			Math.PI * 2,
			true,
		);
		ctx.closePath();
		ctx.fill();

		ctx.restore();
	}
}
