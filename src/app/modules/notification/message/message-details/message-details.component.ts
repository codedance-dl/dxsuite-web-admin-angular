import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageModel } from '@api/models';

@Component({
  selector: 'message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.less']
})
export class MessageDetailsComponent implements OnInit {

  message: MessageModel;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.message = this.route.snapshot.data.message;
  }


}
