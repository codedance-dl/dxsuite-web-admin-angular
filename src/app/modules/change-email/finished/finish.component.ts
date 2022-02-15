import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-change-email-finished',
  templateUrl: 'finish.component.html',
})
export class ChangeEmailFinishedComponent {
  @Input() title: string;
}
