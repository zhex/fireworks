interface IPoint {
	x: number;
	y: number;
}

export class Particle {
	public shrink = 0.97;
	public size = 2;
	public resistance = 1;
	public gravity = 0;
	public flick = false;
	public alpha = 1;
	public fade = 0;
	public color = 0;
	public vel: IPoint = { x: 0, y: 0 };
	public pos: IPoint;

	constructor(x: number, y: number) {
		this.pos = { x, y };
	}

	public get isExist() {
		return this.alpha >= 0.1 && this.size >= 1;
	}

	public render(ctx: CanvasRenderingContext2D) {
		if (!this.isExist) {
			return;
		}

		ctx.save();
		ctx.globalCompositeOperation = 'lighter';

		const { x, y } = this.pos;
		const r = this.size / 2;
        const gradient = ctx.createRadialGradient(x, y, 0.1, x, y, r);
        gradient.addColorStop(0.1, `rgba(255, 255, 255, ${this.alpha})`);
        gradient.addColorStop(0.8, `hsla(${this.color}, 100%, 50%, ${this.alpha})`);
        gradient.addColorStop(1, `hsla(${this.color}, 100%, 50%, 0.1)`);
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(x, y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();

        ctx.restore();
	}

	public update() {
        this.vel.x *= this.resistance;
        this.vel.y *= this.resistance;
        
        this.vel.y += this.gravity;
        
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.size *= this.shrink;

        // this.alpha -= this.fade;
    }
}
