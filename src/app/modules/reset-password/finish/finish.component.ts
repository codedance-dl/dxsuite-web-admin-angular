import { transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { fadeInY } from '@libs/animate/core';

@Component({
  selector: 'app-reset-password-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.less'],
  animations: [
    trigger('fade', [
      transition('void => *', fadeInY({ a: 0, b: 0 }, .2))
    ])
  ]
})
export class ResetFinishComponent {

}
