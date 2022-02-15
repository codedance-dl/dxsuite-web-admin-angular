import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAuthService } from 'src/api/user-auth.service';
import { environment } from 'src/environments/environment';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilesService, UserService } from '@api';
import { Gender, User } from '@api/models';
import { Select, Store } from '@ngxs/store';
import { AuthState, SetIdentity } from '@store/auth';

interface CustomRequestOptions {
  file: File;
}
@Component({
  selector: 'app-user-profile',
  templateUrl: 'profile.component.html'
})
export class UserProfileComponent implements OnInit, OnDestroy {

  // 取得用户基本信息
  @Select(AuthState.getIdentity) getIdentity$: Observable<User | null>;

  form: FormGroup;

  disabled = false;

  gender = Gender;

  userId: string;

  revision: number;

  loading: boolean;

  uploadLoading: boolean;

  uploadUrl = environment.host + '/files/avatars';

  private readonly destroy = new Subject();

  constructor(
    private store: Store,
    private message: NzMessageService,
    private userAuthService: UserAuthService,
    private userService: UserService,
    private filesService: FilesService,
    private fb: FormBuilder
  ) {

    const identity = this.store.selectSnapshot(AuthState.getIdentity);

    this.userId = identity.id;
    this.revision = identity.revision;

    const avatar = this.fb.control('');
    if (identity.avatar) {
      avatar.patchValue(identity.avatar);
    }
    this.form = this.fb.group({
      name: [identity.name, [Validators.required]],
      gender: [identity.gender],
      birthDate: [identity.birthDate],
      avatar
    });
  }

  ngOnInit() {
    this.getUserInfo();
  }

  /**
   * 获取用户信息详情
   */
  getUserInfo() {
    this.userAuthService.getUser().pipe(
      map(result => ({ ...this.store.selectSnapshot(AuthState.getIdentity), ...result }))
    ).subscribe(
      result => {
        if (result) {
          this.revision = result.revision;
          this.store.dispatch(new SetIdentity(result));
        }
      }
    );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * 提交
   */
  onSubmit() {
    // eslint-disable-next-line
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    const params: {
      name: string;
      birthDate?: Date;
      gender?: Gender;
      avatar?: string;
    } = {
      name: this.form.value.name
    };
    if (this.form.value.birthDate) {
      params.birthDate = new Date(this.form.value.birthDate);
    } else {
      params.birthDate = null;
    }
    if (this.form.value.gender) {
      params.gender = this.form.value.gender.toUpperCase();
    } else {
      params.gender = null;
    }

    if (this.form.value?.avatar[0]) {
      params.avatar = this.form.value?.avatar;
    } else {
      params.avatar = null;
    }

    this.userService.modifyOneUser(this.userId, this.revision, params).subscribe(
      response => {
        if (response.success) {
          this.message.create('success', '个人信息修改成功');
          this.loading = false;
          this.getUserInfo();
        }
      },
      error => {
        this.message.create('error', error.error.message || error.error.code);
        this.loading = false;
      }
    );

  }

  customRequest = (options: CustomRequestOptions) => {
    this.uploadLoading = true;
    this.filesService.uploadImg(options.file.name, options.file, 'avatars').subscribe(res => {
      this.uploadLoading = false;
      this.form.get('avatar').setValue(res.data.originalURL);
    }, error => {
      this.uploadLoading = false;
      this.message.create('error', error.error.message || error.error.code);
    });
  };
  // eslint-disable-next-line
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.message.create('error', '图片格式不正确');
        observer.complete();
        return;
      }
      // eslint-disable-next-line
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.message.create('error', '上传图片不超过1MB');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };

  handleChange(info: { file: NzUploadFile }) {
    switch (info.file.status) {
      case 'uploading':
        this.uploadLoading = true;
        break;
      case 'done':
        this.getBase64(info.file.originFileObj, (img: string) => {
          this.uploadLoading = false;
          this.form.get('avatar').setValue(img);
        });
        break;
      case 'error':
        this.message.create('error', 'Network error');
        this.uploadLoading = false;
        break;
    }
  }

  private getBase64(img: File, callback: (img: string) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }
}
