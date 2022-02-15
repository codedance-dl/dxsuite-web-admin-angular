import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageModel } from '@api/models';

@Component({
  selector: 'message-unread-details',
  templateUrl: './message-unread-details.component.html',
  styleUrls: ['./message-unread-details.component.less']
})
export class MessageUnreadDetailsComponent implements OnInit {

  message: MessageModel;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.message = this.route.snapshot.data.message;
  }

}
