/* eslint-disable @typescript-eslint/naming-convention */
import { InjectionToken } from '@angular/core';
import { Routes } from '@angular/router';

export enum NtNavUrlTreeStrategy {
  Integrity = 0,
  OnlyParents = 1
}

export interface NtNavConfig {
  routes: Routes;
  baseUrl?: string;
  resolvePlaceholder?: string;
  urlTreeStrategy?: NtNavUrlTreeStrategy;
}

export const NT_NAV_CONFIG = new InjectionToken<NtNavConfig>('nt-nav-config');
