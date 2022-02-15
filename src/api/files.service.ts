import { Injectable } from '@angular/core';
import { FilesQuery, FilesSetOwnerData } from '@api/models';
import { environment } from '@environments/environment';

import { DataService } from './data-service';

declare type FileCategory = 'avatars' | 'covers' | 'figures' | 'photos';

@Injectable({ providedIn: 'root' })
export class FilesService extends DataService {

  host = environment.host;
  tenantId = environment.orgId;

  upload(blob: Blob, category?: FileCategory) {
    return this.http.post(category ? `/files/${category}` : '/files', {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      reportProgress: true
    });
  }

  uploadImg(name: string, body: File, category?: FileCategory) {
    return this.http.post(`/files/${category}?name=${name}`, body, {
      headers: {
        'content-type': 'image/png'
      },
      reportProgress: true
    });
  }

  create(tenantId: string, query?: FilesQuery) {
    return this.http.post(`/tenants/${tenantId}/files` + this.queryParse(query), null);
  }

  createChild(tenantId: string, parentId: string, query?: FilesQuery) {
    return this.http.post(`/tenants/${tenantId}/files/${parentId}/files` + this.queryParse(query), null);
  }

  delete(tenantId: string, fileId: string) {
    return this.http.delete(`/tenants/${tenantId}/files/${fileId}`);
  }

  setOwners(tenantId: string, fileId: string, data: FilesSetOwnerData) {
    return this.http.post(`/tenants/${tenantId}/files/${fileId}/owners`, data);
  }

  deleteOwners(tenantId: string, fileId: string, ownerId: string) {
    return this.http.delete(`/tenants/${tenantId}/files/${fileId}/owners/${ownerId}`);
  }

  getFileDetail(tenantId: string, fileId: string) {
    return this.http.get(`/tenants/${tenantId}/files/${fileId}`);
  }

  getFilesByOwnerAndDirectory(tenantId: string, ownerId: string, parentId: string, query?: FilesQuery) {
    return this.http.get(`/tenants/${tenantId}/owners/${ownerId}/files/${parentId}/files` + this.queryParse(query));
  }

  getAssumeRole(fileKey: string) {
    return this.http.get(`/files/${fileKey}/assume-role`);
  }

  getRootDirectoryByOwner(tenantId: string, ownerId: string, query?: FilesQuery) {
    return this.http.get(`/tenants/${tenantId}/owners/${ownerId}/files` + this.queryParse(query));
  }

  download(entryId: string) {
    return this.http.get<Blob>(`/tenants/${this.tenantId}/files/${entryId}/download`, { responseType: 'blob' });
  }

  downloadMulti(entryIds: string[]) {
    return this.http.post<Blob>(`/tenants/${this.tenantId}/multi-files-download`, entryIds, { responseType: 'blob' });
  }

  moveTo(tenantId: string, fileId: string, target: string) {
    return this.http.put(`/tenants/${tenantId}/files/${fileId}/directory` + this.queryParse({ target }));
  }

}
