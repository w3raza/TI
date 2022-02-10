function nToString(n) {
    return Math.round(n * 10000000) / 10000000;
  }
  
  function inRad(num) {
      return num * Math.PI / 180;
  }
  
  const g = 9.82;
  let Final_times = 0.0;
  
  class Scene {
    constructor(context) {
      this.ctx = context;
      this.width = 800;
      this.height = 800;
      this.inputs = {};
      this.out = {};
      this.time = 0;
      this.state = 1;
      this.prevTime = 0;
      this.delta = 0;
      this.cargo = {
          mass: 1,
          y: 80,
          acc: 12,
          speed: 0,
          fallen: false,
          tFall: 0
      }
      this.cross = {
          eps: 0,
          phi: 0,
          speed: 0,
          I: 0
      }
    }
  
    start() {
      this.state = 0;
      this.inputs.start.html('Start');
    }
  
    pause() {
      this.state = 1;
      this.inputs.start.html('Pause');
    }
  
    reset() {
        this.pause();
  
        this.time = 0;
        this.state = 1;
        this.prevTime = 0;
        this.delta = 0;
        this.cargo.mass = 0;
        this.cargo.y = 80;
        this.cargo.acc = 0;
        this.cargo.speed = 0;
        this.cargo.fallen = false;
        this.cargo.tFall = 0;
        this.cross.eps = 0;
        this.cross.phi = 0;
        this.cross.speed = 0;
        Final_times = 0.0;
    }
  
    drawFloor() {
          let ctx = this.ctx;
  
          ctx.beginPath();
          ctx.moveTo(0, 760);
          ctx.lineTo(800, 760);
          ctx.stroke();
  
          for (let i = 0; i < 20; ++i) {
              ctx.beginPath();
              ctx.moveTo(i * 40, 800);
              ctx.lineTo(40 + i * 40, 760);
              ctx.stroke();
          }
    }
  
    drawRuler() {
          let ctx = this.ctx;
  
          ctx.beginPath();
          ctx.moveTo(0, 760);
          ctx.lineTo(0, 0);
          ctx.stroke();
  
          for (let i = 0; i < 19; ++i) {
              ctx.beginPath();
              ctx.moveTo(0, 760 - i * 40);
              ctx.lineTo(0, 760 - i * 40);
              ctx.stroke();
  
              if (i != 19) {
                  ctx.lineWidth = 1;
                  for (let j = 1; j < 10; ++j) {
                      ctx.beginPath();
                      ctx.moveTo(0, 760 - i * 40 - j * 4);
                      ctx.lineTo(10, 760 - i * 40 - j * 4);
                      ctx.stroke();
                  }
                  ctx.lineWidth = 2;
              }
              ctx.fillText(nToString(i * 0.1) + 'm', 20, 765 - i * 40);
          }
    }
  
    drawCross() {
      let ctx = this.ctx;
      ctx.beginPath();
      let xc = 500, yc = 350, delta = 200;
      let R2 = 150 * (+document.getElementById('inputR2').value);
      ctx.moveTo(xc, yc);
      ctx.lineTo(xc, 760);
      ctx.moveTo(xc + 284, yc);
      ctx.arc(xc, yc, 284, 0, 2 * Math.PI);
      ctx.moveTo(xc + 294, yc);
      ctx.arc(xc, yc, 294, 0, 2 * Math.PI);
      ctx.moveTo(xc + R2, yc);
      ctx.arc(xc, yc, R2, 0, 2 * Math.PI);
      ctx.stroke();
  
      ctx.save();
      ctx.translate(xc, yc);
      ctx.rotate(this.cross.phi);
      xc = yc = 0;
      ctx.moveTo(xc, yc);
      ctx.lineTo(xc - delta, yc - delta);
      ctx.moveTo(xc, yc);
      ctx.lineTo(xc + delta, yc - delta);
      ctx.moveTo(xc, yc);
      ctx.lineTo(xc - delta, yc + delta);
      ctx.moveTo(xc, yc);
      ctx.lineTo(xc + delta, yc + delta);
  
      delta = 20;
      let R1 = 230 * document.getElementById('inputR1').value;
      if ((R2 + delta) > R1) {
          R1 = R2 + delta;
          R2 = R2;
      } else {
          R1 = 230 * document.getElementById('inputR1').value;
      }
      ctx.translate(xc, yc);
      ctx.rotate(inRad(45));
      ctx.fillStyle = '#000000';
      ctx.fillRect(xc - delta, yc - R1 - delta, 40, 40);
      ctx.fillRect(xc - delta, yc + R1 - delta, 40, 40);
      ctx.fillRect(xc + R1 - delta, yc - delta, 40, 40);
      ctx.fillRect(xc - R1 - delta, yc - delta, 40, 40);
      ctx.restore();
      ctx.stroke();
    }
  
    drawCargo() {
        let H = +document.getElementById('inputH').value;
        if (H > 1.7)
        {
            H = 45 + 1.7 * 400;
        } else {
            H = 45 + document.getElementById('inputH').value * 400;
        }
        if (this.cargo.fallen) {
            H = 740;
            if (Final_times == 0) Final_times = this.time / 1000;
        }
        else H = Math.min(800 - H + 400 * this.cargo.acc * Math.pow(this.time * 0.001, 2) / 2, 740);
        if (!this.cargo.fallen && H === 740) {
            this.cargo.tFall = this.time;
            this.cargo.fallen = true;
        }
      let ctx = this.ctx;
      let R2 = 150 * document.getElementById('inputR2').value;
      ctx.beginPath();
      ctx.moveTo(70, 50);
      ctx.lineTo(70, 760);
      ctx.moveTo(130, 50);
      ctx.arc(100, 50, 30, 0, 2 * Math.PI);
      ctx.moveTo(122, 29);
      ctx.lineTo(500 + R2 / 2, 350 - R2 * Math.sqrt(3) / 2);
      ctx.moveTo(60, 80);
      ctx.fillRect(60, H, 20, 20);
      ctx.stroke();
    }
  
    initInput() {
      let inputs = this.inputs;
      inputs.H = document.getElementById('inputH');
      inputs.m1 = $('#inputM1');
      inputs.m2 = $('#inputM2');
      inputs.start = $('#inputStart');
      inputs.reset = $('#inputReset');
      inputs.F = $('#inputF');
      inputs.R1 = $('#inputR1');
      inputs.R2 = $('#inputR2');
  
      this.updateInput();
  
      inputs.start.click((e) => {
        e.preventDefault();
        this.state == 0 ? this.pause() : this.start();
      });
  
      inputs.reset.click((e) => {
        e.preventDefault();
        this.reset();
      });
  
  
      this.inputs.h = document.getElementById('inputH').value;
  
    }
  
    updateInput() {
      let inputs = this.inputs;
    }
  
    initOutput() {
      let out = this.out;
    }
  
    updateOutput() {
      let out = this.out;
      let times = this.time / 1000;
      let ScaleTime;
      let H = +document.getElementById('inputH').value;
      let m1 = +document.getElementById('inputM1').value;
      let R1 = +document.getElementById('inputR1').value;
      let R2 = +document.getElementById('inputR2').value;
      let F_friction = +document.getElementById('inputF').value;
      let m2 = +document.getElementById('inputM2').value;
      let delta = 20;
      if ((150 * R2 + delta) > 230 * R1) {
          R1 = (150 * R2 + delta) / 230;
          R2 = R1;
          R1 = 0.15 + ((R1 - 0.1) * 0.5);
          R2 = 0.15 + ((R2 - 0.1) * 0.5);
      } else {
          R1 = 0.15 + ((R1 - 0.1) * 0.5);
          R2 = 0.15 + ((R2 - 0.1) * 0.5) * 150 / 210;
      }
  
      ScaleTime = Math.pow(2, +document.getElementById('inputTimeScale').value);
      this.timeScale = ScaleTime;
      this.cross.I = 4 * m2 * Math.pow(R1, 2);
      this.cross.eps = (g * m1 - F_friction) * R2 / (this.cross.I + m1 * Math.pow(R2, 2));
      this.cargo.acc = this.cross.eps * R2;
  
      let F_tension = m1 * (g - this.cargo.acc);
  
      let M_tension = F_tension * R2;
  
      let M_friction = F_friction * R2;
  
      $('#outFinalTime').html(Final_times.toFixed(2));
      $('#outTimeScale').html(ScaleTime.toFixed(2));
      $('#outR1').html(R1.toFixed(2));
      $('#outR2').html(R2.toFixed(2));
      $('#outTime').html(times.toFixed(2));
      $('#outAcc').html(this.cargo.acc.toFixed(2));
      $('#outF_tension').html(F_tension.toFixed(2));
      $('#outM_tension').html(M_tension.toFixed(2));
      $('#outAngAcc').html(this.cross.eps.toFixed(2));
      $('#outM_friction').html(M_friction.toFixed(2));
      $('#outI').html(this.cross.I.toFixed(2));
    }
  
    updateLastOutput() {
      let out = this.out;
    }
  
    update() {
        let H = +document.getElementById('inputH').value;
        if (H > 1.7)
        {
            H = 45 + 1.7 * 400;
        } else {
            H = 45 + document.getElementById('inputH').value * 400;
        }
        let m1 = +document.getElementById('inputM1').value;
        let R1 = +document.getElementById('inputR1').value;
        let R2 = +document.getElementById('inputR2').value;
        let F_friction = +document.getElementById('inputF').value;
        let m2 = +document.getElementById('inputM2').value;
        let delta = 20;
        if ((150 * R2 + delta) > 230 * R1) {
            R1 = (150 * R2 + delta) / 230;
            R2 = R1;
            R1 = 0.15 + ((R1 - 0.1) * 0.5); 
            R2 = 0.15 + ((R2 - 0.1) * 0.5);
        } else{
            R1 = 0.15 + ((R1 - 0.1) * 0.5);
            R2 = 0.15 + ((R2 - 0.1) * 0.5) * 150 / 210;
  
        }
        
        this.cross.I = 4 * m2 * Math.pow(R1, 2);
  
        if (!this.cargo.fallen)
          this.cross.eps = (Math.max(g * m1 - F_friction, 0)) * R2 / (this.cross.I + m1 * Math.pow(R2, 2));
        else this.cross.eps = -F_friction * R2 / this.cross.I;
  
        this.cross.speed += this.cross.eps * this.delta * 0.001;
        if (this.cross.speed >= 0)
          this.cross.phi -= this.cross.speed * this.delta * 0.001 + Math.pow(this.delta * 0.001, 2) * this.cross.eps / 2;
        else {
            this.cross.speed = 0;
        }
        this.cargo.y += 400 * this.cargo.acc * Math.pow(this.delta * 0.001, 2) / 2;
        this.cargo.y = Math.min(this.cargo.y, 740);
        if (!this.cargo.fallen)
            this.cargo.acc = this.cross.eps * R2;
        else this.cargo.acc = 0;
        this.cargo.speed = this.cargo.acc * this.time * 0.001;
  
    }
  
    render() {
        let ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        this.drawFloor();
        this.drawRuler();
        this.drawCross();
        this.drawCargo();
        this.updateOutput();
    }
  
    startLoop() {
      this.prevTime = performance.now();
  
      let loop = (time) => {
        if (this.state == 0) {
          this.delta = time - this.prevTime;
          this.delta *= this.timeScale;
          this.time += this.delta;
          this.update();
        }
  
        this.render();
  
        this.prevTime = time;
        this.frame = requestAnimationFrame(loop);
      };
  
      this.frame = requestAnimationFrame(loop);
    }
  }
  
  $(document).ready(() => {
    let canvas = $('#canvas');
    let height = canvas.height();
    let width = canvas.width();
    let size = height < width ? height : width;
  
    canvas.width(size);
    canvas.height(size);
    canvas.css('flex-grow', 0);
  
    canvas.attr('width', 800);
    canvas.attr('height', 800);
  
    let ctx = canvas[0].getContext('2d');
  
    ctx.lineWidth = 2;
    ctx.font = '500 15px Segoe UI';
  
    let scene = new Scene(ctx);
  
    scene.initInput();
    scene.initOutput();
    scene.updateOutput();
    scene.startLoop();
  });