import { Injectable } from '@angular/core';

import { DataService } from './data-service';

import { Tags } from './models';

@Injectable({ providedIn: 'root' })
export class TagsService extends DataService {

  // 查询标签
  search(tenantId: string, query?: Tags.TagsQuery) {
    return this.http.get(`/tenants/${tenantId}/tags` + this.queryParse(query));
  }

  searchByCode(tenantId: string, tagTypeCode: string, query?: Tags.TagsQuery) {
    return this.http.get(`/tenants/${tenantId}/tag-types/${tagTypeCode}/tags` + this.queryParse(query));
  }

  // 查询标签详情
  detail(tenantId: string, tagId: string) {
    return this.http.get(`/tenants/${tenantId}/tags/${tagId}`);
  }

  // 创建标签
  create(tenantId: string, tagTypeCode: string, data: Tags.TagsCreateBody) {
    return this.http.post(`/tenants/${tenantId}/tag-types/${tagTypeCode}/tags`, data);
  }

  // 创建子标签
  createChildTags(tenantId: string, tagTypeCode: string, parentId: string, data: Tags.TagsCreateBody) {
    return this.http.post(`/tenants/${tenantId}/tag-types/${tagTypeCode}/tags/${parentId}/tags`, data);
  }

  // 更新标签
  update(tenantId: string, tagTypeCode: string, tagId: string, data: Tags.TagsUpdateBody, revision?: number ) {
    return this.http.patch(`/tenants/${tenantId}/tag-types/${tagTypeCode}/tags/${tagId}` + this.queryParse({ revision }), data);
  }

  // 删除标签
  delete(tenantId: string, tagTypeCode: string, tagId: string, revision?: number) {
    return this.http.delete(`/tenants/${tenantId}/tag-types/${tagTypeCode}/tags/${tagId}` + this.queryParse({ revision }),);
  }

  // -----------------------------------------------标签类型----------------------------------------------- //

  // 取得标签类型列表
  tagType(tenantId: string, query: Tags.TagTypeQuery) {
    return this.http.get(`/tenants/${tenantId}/tag-types` +  this.queryParse(query));
  }

  // 取得标签类型详细信息
  tagTypeDetail(tenantId: string, tagTypeCode: string) {
    return this.http.get(`/tenants/${tenantId}/tag-types/${tagTypeCode}`);
  }

  // 创建标签类型
  createTagsTypes(tenantId: string, tagTypeCode: string, data: Tags.TagTypeCreateBody) {
    return this.http.post(`/tenants/${tenantId}/tag-types/${tagTypeCode}`, data);
  }

  // 更新标签类型
  updateTagsTypes(tenantId: string, tagTypeCode: string, data: Tags.TagTypeUpdateBody, revision?: number) {
    return this.http.patch(`/tenants/${tenantId}/tag-types/${tagTypeCode}` + this.queryParse({ revision }), data);
  }

  // 删除标签类型
  deleteTagsTypes(tenantId: string, tagTypeCode: string, revision?: number) {
    return this.http.delete(`/tenants/${tenantId}/tag-types/${tagTypeCode}` + this.queryParse({ revision }));
  }
}
