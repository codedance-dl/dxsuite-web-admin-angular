import { InjectionToken } from "@angular/core";

export interface UploadMonitorContainer {
  close(): void;
}

export const UPLOAD_MONITOR_CONTAINER = new InjectionToken<UploadMonitorContainer>('upload-monitor-container');
