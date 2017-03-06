import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the About page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidEnter(){
      console.log('init starfield ...');
      let field = <HTMLCanvasElement>document.getElementById('field');
      let stars = [];
      let ctx = field.getContext('2d');
      let gen = function(z) {
          return {
              x: 0 | (Math.random() * 400 - 200),
              y: 0 | (Math.random() * 400 - 150),
              z: z || (0 | Math.random() * 15)
          };
      }
      for (let i = 0; i < 200; stars.push(gen(i++)));
      setInterval(function() {
          ctx.clearRect(0, 0, 400, 300);
          ctx.font = '20pt Arial';
          for (let star in stars) {
              ctx.fillStyle = '#' + Array(7).join((0 | stars[star].z).toString(16));
              ctx.fillText(
                  '.',
                  stars[star].x / stars[star].z + 200,
                  stars[star].y / stars[star].z + 150
              );
              stars[star].z -= 0.25;
              if (stars[star].z <= 0) {
                  stars[star] = gen(15);
              }
          }
      }, 20);
  }
}
