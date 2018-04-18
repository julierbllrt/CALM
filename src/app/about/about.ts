/**
 * Created by ISEN on 08/03/2017.
 */
import {Component, OnInit, PipeTransform, Pipe} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser'

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}


@Component({
  selector: 'about-page',
  templateUrl: 'about.html',
  styleUrls: ['about.css']
})
export class AboutComponent {
  video: string ="https://www.youtube.com/embed/KXdNGiiHTjk"
  
}
