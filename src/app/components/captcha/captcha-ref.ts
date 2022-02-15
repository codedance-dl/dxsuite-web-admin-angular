import { Observable, Subject, Subscription, SubscriptionLike } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { OverlayRef } from '@angular/cdk/overlay';
import { Location } from '@angular/common';

import { CaptchaComponent, CaptchaValue } from './captcha.component';
import { DataServiceError } from '@api/models';

let uniqueId = 0;

export class CaptchaRef {

  private _afterOpen = new Subject<void>();
  private _afterClosed = new Subject<CaptchaValue | undefined>();
  private _beforeClose = new Subject<CaptchaValue | undefined>();
  private _locationChanges: SubscriptionLike = Subscription.EMPTY;

  private _value: CaptchaValue;

  constructor(
    private _overlayRef: OverlayRef,
    private _captchaInstance: CaptchaComponent,
    location?: Location,
    readonly id: string = `cod-captcha-${uniqueId++}`) {

    // Emit when opening animation completes
    _captchaInstance.animationStateChanged
      .pipe(filter(event => event.phaseName === 'done' && event.toState === 'enter'), take(1))
      .subscribe(() => {
        this._afterOpen.next();
        this._afterOpen.complete();
      });

    // Dispose overlay when closing animation is complete
    _captchaInstance.animationStateChanged
      .pipe(filter(event => event.phaseName === 'done' && event.toState === 'exit'), take(1))
      .subscribe(() => {
        this._overlayRef.dispose();
        this._locationChanges.unsubscribe();
        this._afterClosed.next(this._value);
        this._afterClosed.complete();
      });

    _captchaInstance.captchaValue
      .subscribe(value => this.close(value));

    if (location) {
      this._locationChanges = location.subscribe(() => this.close());
    }
  }

  close(value?: CaptchaValue) {
    this._value = value;

    // // Transition the backdrop in parallel to the modal.
    this._captchaInstance.animationStateChanged
      .pipe(filter(event => event.phaseName === 'start'), take(1))
      .subscribe(() => {
        this._beforeClose.next(value);
        this._beforeClose.complete();
        this._overlayRef.detachBackdrop();
      });

    this._captchaInstance.exit();
  }

  afterOpen(): Observable<void> {
    return this._afterOpen.asObservable();
  }

  afterClosed(): Observable<CaptchaValue | undefined> {
    return this._afterClosed.asObservable();
  }

  beforeClose(): Observable<CaptchaValue | undefined> {
    return this._beforeClose.asObservable();
  }

  backdropClick(): Observable<MouseEvent> {
    return this._overlayRef.backdropClick();
  }

  captchaVerifyError(): Observable<DataServiceError> {
    return this._captchaInstance.captchaVerifyError.asObservable();
  }
}
