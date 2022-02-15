export namespace Tags {
  export interface TagsQuery {
    depth?: number;
    entityId?: string;
    pageNo?: number;
    pageSize?: number;
    parentId?: string;
    sortBy?: string[];
    tenantId?: string;
    text?: string;
    type?: string;
  }

  export interface TagsCreateBody {
    backColor?: string;
    foreColor?: string;
    text: string;
    weight?: number;
  }

  export interface TagsUpdateBody {
    weight?: number;
    text?: string;
    parentId: string;
    maxTagsPerEntity?: number;
  }

  export interface TagTypeQuery {
    name?: string;
    pageNo?: number;
    pageSize?: number;
    sortBy?: string[];
    tenantId?: string;
  }

  export interface TagTypeCreateBody {
    name: string;
    maxTagsPerEntity?: number;
    weight?: number;
  }

  export interface TagTypeUpdateBody {
    name: string;
    maxTagsPerEntity?: number;
    weight?: number;
  }
}