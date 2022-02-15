import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAuthService } from 'src/api/user-auth.service';
import { environment } from 'src/environments/environment';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FilesService } from '@api';
import { Gender, User } from '@api/models';
import { Select, Store } from '@ngxs/store';
import { AuthState, SetIdentity } from '@store/auth';

import { CanDeactivateGuard } from '../../../guard';

interface CustomRequestOptions {
  file: File;
}
@Component({
  selector: 'app-demo-advance-form',
  templateUrl: './advance-form.component.html',
})
export class AdvanceFormComponent implements OnInit, OnDestroy, CanDeactivateGuard {
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

  user: User;

  private readonly destroy = new Subject();

  constructor(
    private store: Store,
    private message: NzMessageService,
    private userAuthService: UserAuthService,
    private filesService: FilesService,
    private fb: FormBuilder
  ) {

    const identity = this.store.selectSnapshot(AuthState.getIdentity);
    this.user = identity;
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
      avatar,
      description: ['', [Validators.required]],
    });
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    throw new Error('Method not implemented.');
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
    this.message.create('success', '提交成功');
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

  /**
   * 确认是否离开当前表单
   */
  confirm(message: string): Observable<boolean> {
    const confirmation = window.confirm(message || '确认离开吗?');
    return of(confirmation);
  }


  /**
   * 路由离开当前页面判断是否提示
   * @returns
   */
  canDeactivate(): Observable<boolean> | boolean {
    if (!this.formValueCompare()) return true; //未发生变化
    return this.confirm('当前表单尚未保存，确认离开？');
  }

  formValueCompare() {
    const value = this.form.value;
    const nameValueChanged = value.name !== (this.user.name || '');
    const birthDateValueChanged = moment(value.birthDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') !== moment(this.user.birthDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const genderValueChanged = value.gender !== (this.user.gender || '');
    const avatarValueChanged = value.avatar !== (this.user.avatar || '');
    const descriptionValueChanged = value.description !== (this.user.description || '');
    return nameValueChanged
      || birthDateValueChanged
      || genderValueChanged
      || avatarValueChanged
      || descriptionValueChanged;
  }

  private getBase64(img: File, callback: (img: string) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }
}