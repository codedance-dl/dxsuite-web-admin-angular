import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAuthService } from 'src/api/user-auth.service';

import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { ComponentRef, ElementRef, Injectable, Injector, Optional } from '@angular/core';

import { CaptchaRef } from './captcha-ref';
import { CaptchaComponent, CaptchaOptions, INITIAL_CAPTCHA } from './captcha.component';

export interface IInitalCaptcha  {
  encryptedData: string;
  imageData: string;
  validUntil: string;
}

@Injectable()
export class Captcha {
  private openCaptchasAtThisLevel: CaptchaRef[] = [];
  private afterAllClosedAtThisLevel = new Subject<void>();
  private afterOpenAtThisLevel = new Subject<CaptchaRef>();

  constructor(
    @Optional() private location: Location,
    private overlay: Overlay,
    private injector: Injector,
    private userAuthService: UserAuthService
  ) {}

  checkAndOpen(container: ElementRef, options: CaptchaOptions): Observable<CaptchaRef | undefined> {
    return this.userAuthService
      .getCaptcha({ credential: options.credential })
      .pipe(map(({ data }) => data ? this.open(container, options, data) : null));
  }

  open(container: ElementRef, options: CaptchaOptions, initalCaptcha?: IInitalCaptcha): CaptchaRef {
    const overlayRef = this._createOverlay(container, options);
    const captchaComponentRef = this._attachCaptchaComponent(overlayRef, options, initalCaptcha);
    const captchaRef = this._createCaptchaRef(captchaComponentRef, overlayRef, options);

    this.openCaptchasAtThisLevel.push(captchaRef);
    captchaRef.afterClosed().subscribe(() => this._removeOpenCaptcha(captchaRef));
    this.afterOpenAtThisLevel.next(captchaRef);

    return captchaRef;
  }

  private _createOverlay(container: ElementRef, options: CaptchaOptions) {
    const overlayConfig = this._getOverlayConfig(container, options);
    return this.overlay.create(overlayConfig);
  }

  private _attachCaptchaComponent(overlayRef: OverlayRef, options: CaptchaOptions, initalCaptcha?: IInitalCaptcha) {
    let catpchaInjecgtor: Injector;
    if (initalCaptcha) {
      const injectionTokens = new WeakMap();
      injectionTokens.set(INITIAL_CAPTCHA, initalCaptcha);
      catpchaInjecgtor = new PortalInjector(this.injector, injectionTokens);
    } else {
      catpchaInjecgtor = this.injector;
    }

    const captchaPortal = new ComponentPortal(CaptchaComponent, null, catpchaInjecgtor);
    const containerRef: ComponentRef<CaptchaComponent> = overlayRef.attach(captchaPortal);
    containerRef.instance.options = options;
    return containerRef.instance;
  }

  private _createCaptchaRef(captchaComponent: CaptchaComponent, overlayRef: OverlayRef, options: CaptchaOptions): CaptchaRef {
    const captchaRef = new CaptchaRef(overlayRef, captchaComponent, this.location);

    if (options.hasBackdrop) {
      overlayRef.backdropClick().subscribe(() => {
        captchaRef.close();
      });
    }

    return captchaRef;
  }

  private _removeOpenCaptcha(captchaRef: CaptchaRef) {
    const index = this.openCaptchasAtThisLevel.indexOf(captchaRef);

    if (index > -1) {
      this.openCaptchasAtThisLevel.splice(index, 1);

      if (!this.openCaptchasAtThisLevel.length) {
        this.afterAllClosedAtThisLevel.next();
      }
    }
  }

  private _getOverlayConfig(container: ElementRef, options: CaptchaOptions): OverlayConfig {
    const position: ConnectedPosition = {
      originX: 'center',
      originY: 'center',
      overlayX: 'center',
      overlayY: 'center'
    };

    const positionStrategy = this.overlay.position().flexibleConnectedTo(container).withPositions([position]);
    return new OverlayConfig({
      panelClass: 'captcha-panel',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
      hasBackdrop: options.hasBackdrop
    });
  }
}
