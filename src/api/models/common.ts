export interface CreatedBy {
  id?: string;
  name?: string;
}

export interface LastModifiedBy {
  id?: string;
  name?: string;
}

export interface DisabledBy {
  id?: string;
  name?: string;
}

export interface BaseQuery {
  name?: string;
  keyword?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string[] | string;
}
