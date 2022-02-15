export interface AssetModel {
  id: string;
  code: string;
  name: string;
  amount: number;
  specs: string;
  unit: string;
  orgId: string;
  org: {
    id: string;
    name: string;
  };
  ownerId: string;
  owner: {
    id: string;
    name: string;
  };
  supervisorId: string;
  supervisor: {
    id: string;
    name: string;
  };
  comment: string;
  sn: string;
  validUntil: Date;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
  source: string;
}
