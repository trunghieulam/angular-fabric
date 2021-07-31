import { Component, ElementRef, ViewChild } from '@angular/core';
import 'fabric';
declare const fabric: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'video';

  image: any;
  file: File | any = null;
  canvas: any;

  @ViewChild('video', { static: false }) videoEl: ElementRef | undefined;

  constructor() {}

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas');
  }

  ngAfterViewInit() {
    const videoEl = this.videoEl?.nativeElement;
    if (videoEl) {
      console.log('yes');
      const video = new fabric.Image(videoEl, {
        left: 0,
        top: 0,
        angle: 0,
        originX: 0,
        originY: 0,
        objectCaching: true,
        statefullCache: true,
        cacheProperties: ['videoTime'],
      });
      setTimeout(() => {
        video?.getElement()?.play();
        this.canvas.add(video);

        const that = this;
        fabric.util.requestAnimFrame(function render() {
          that.canvas.renderAll();
          video.videoTime = videoEl.currentTime;
          fabric.util.requestAnimFrame(render);
        });
      }, 500);
    }
  }

  handleDrop(e: any) {
    this.file = e.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (imgFile: any) => {
      console.log(imgFile);
      const data = imgFile.target['result'];
      fabric.Image.fromURL(data, (img: any) => {
        let oImg = img
          .set({
            left: 0,
            top: 0,
            angle: 0,
          })
          .scale(1);
        this.canvas.add(oImg).renderAll();
        var a = this.canvas.setActiveObject(oImg);
        var dataURL = this.canvas.toDataURL({ format: 'png', quality: 0.8 });
      });
    };
    reader.readAsDataURL(this.file);
    return false;
  }
}
