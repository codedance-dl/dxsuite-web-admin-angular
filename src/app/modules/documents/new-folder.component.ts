import { NzModalRef } from 'ng-zorro-antd/modal';

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: 'new-folder.component.html'
})

export class NewFolderComponent {

  form: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.maxLength(20)]],
    isDirectory: true
  });

  constructor(
    private modal: NzModalRef,
    private formBuilder: FormBuilder,
  ) { }

  onSubmit() {
    console.log(this.form.valid);
    if (this.form.valid) {
      this.modal.close({ data: this.form.value });
    } else {
      for (const i in this.form.controls) {
        if (Object.prototype.hasOwnProperty.call(this.form.controls, i)) {
          this.form.controls[i].markAsDirty();
          this.form.controls[i].updateValueAndValidity();
        }
      }
    }
  }

  cancel() {
    this.modal.close();
  }

}
