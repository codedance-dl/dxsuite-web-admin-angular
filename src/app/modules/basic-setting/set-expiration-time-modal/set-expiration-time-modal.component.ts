import { NzModalRef } from 'ng-zorro-antd/modal';

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-set-expiration-time-modal',
  templateUrl: './set-expiration-time-modal.component.html',
  styleUrls: ['./set-expiration-time-modal.component.scss']
})
export class SetExpirationTimeModalComponent implements OnInit {

  @Input() data;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      value: [this.data.value, [Validators.required, Validators.min(1)]]
    });
  }


  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.modalRef.close(this.form.value);
  }

  close() {
    this.modalRef.close({ value: null });
  }

}
