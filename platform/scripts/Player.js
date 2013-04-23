(function (Ω) {

	"use strict";

	var Player = Ω.Entity.extend({

		w: 25,
		h: 45,
		dir: 1,

		sheet: new Ω.SpriteSheet("res/charzera.png", 25, 45),
		sounds: {
			"crouch": new Ω.Sound("res/crouch.wav", 1)
		},

		init: function (startX, startY, isPlayer) {

			this.isPlayer = isPlayer;

			this.anims = new Ω.Anims([
				new Ω.Anim("idle", this.sheet, 500, [[8, 0], [9, 0]]),
				new Ω.Anim("walk", this.sheet, 70, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]]),
				new Ω.Anim("walkLeft", this.sheet, 70, [[13, 3], [12, 3], [11, 3], [10, 3], [9, 3], [8, 3], [7, 3], [6, 3]])
			]);

			this.x = startX;
			this.y = startY;
			this.speed = 1 + Math.random() * 0.2;

			this.anims.set(isPlayer ? "idle" : "walk");

			this.particle = new Ω.Particle({});

		},

		tick: function (d, map) {

			var x1 = 0,
				y1 = 0;

			this.anims.tick(d);
			this.particle.tick(d);

			if (this.isPlayer) {
				this.speed = Math.abs(this.speed);

				if (Ω.input.isDown("left")) {
					this.anims.setTo("walkLeft");
					x1 -= this.speed;
				}
				if (Ω.input.isDown("right")) {
					this.anims.setTo("walk");
					x1 += this.speed;
				}
				if (Ω.input.isDown("up")) {
					y1 -= this.speed;
				}
				if (Ω.input.isDown("down")) {
					y1 += this.speed;
				}

				if(x1 === 0 && y1 === 0) {
					this.anims.setTo("idle");
					if (this.anims.changed()) {
						//this.anims.setTo("idleLeft");
					}
				}

			} else {
				x1 += d * (this.speed * this.dir);
			}

			this.move(x1, y1, map);

		},

		hitBlocks: function (blocks) {

			if (!this.isPlayer) {
				this.dir *= -1;
				this.anims.setTo(this.dir > 0 ? "walk" : "walkLeft");
			}

		},

		hit: function (by) {

			if (this.isPlayer) {
				if (!this.particle.running) {
					this.particle.play(this.x + (this.w / 2), this.y + 10);
					this.sounds.crouch.play();
				}
			}

		},

		render: function (gfx) {

			this.anims.render(gfx, this.x, this.y);
			this.particle.render(gfx);
			gfx.ctx.strokeStyle = "rgba(100, 0, 0, 0.3)";
			gfx.ctx.strokeRect(this.x, this.y, this.w, this.h);

		}

	});

	window.Player = Player;

}(Ω));
