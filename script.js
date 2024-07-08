let canvas;
let ctx;
let flowField;
let flowFieldAnimation;


window.onLoad = function() {
    canvas = document.getElementById('canvas1');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate(0);



}   

window.addEventListener('resize', function() {
    this.cancelAnimationFrame(flowFieldAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate(0);
});

const mouse = {
    x: 0,
    y: 0,
}

window.addEventListener('mousemove', function(e){
    
    mouse.x = e.x;
    mouse.y = e.y;
})

class FlowFieldEffect {
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.lineWidth = 1;
        this.#width = width;
        this.#height = height;
        console.log('effect loaded');
        
        this.lastTime = 0;
        this.interval = 1000/60;
        this.timer = 0;
        this.cellSize = 15;
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.radius = 6;
        this.vr = 0.03;

    }
    #createGradient() {
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop(0.1, "rgba(255, 92, 51, 0.5)");
        this.gradient.addColorStop(0.2, "rgba(255, 102, 179, 0.5)");
        this.gradient.addColorStop(0.4, "rgba(204, 204, 255, 0.5)");
        this.gradient.addColorStop(0.6, "rgba(179, 255, 255, 0.5)");
        this.gradient.addColorStop(0.8, "rgba(128, 255, 128, 0.5)");
        this.gradient.addColorStop(0.9, "rgba(255, 255, 51, 0.5)");
    }
    #drawLine(angle, x, y) {
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = dx * dx + dy * dy;
        if (distance > 600000) distance = 600000;
        else if (distance < 2000) distance = 2000;


        let length = distance/10000;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x + Math.cos(angle) * 30, y + Math.sin(angle) * length);
        this.#ctx.stroke();
    }
    animate(timeStamp) {
        let deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if (this.timer > this.interval) {
            
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
           // this.radius += this.vr;
           // if (this.radius > 10 || this.radius < -10) this.vr *= -1;


            for (let y = 0; y < this.#height; y+= this.cellSize) {
                for (let x = 0; x < this.#width; x += this.cellSize) {
                    const angle = (Math.cos(mouse.x * x * 0.0001) + Math.sin(mouse.y * y * 0.0001)) * this.radius;
                    this.#drawLine(angle, x, y);
                }
            }
            

            this.timer = 0;

        } else {
            this.timer += deltaTime;
        }
        
      
       
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }
}