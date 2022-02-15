import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-change-mobile-finished',
  templateUrl: 'finish.component.html',
})
export class ChangeMobileFinishedComponent {
  @Input() title: string;
}
