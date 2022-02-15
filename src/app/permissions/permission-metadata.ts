import { PermissionMeta } from './permissions';

export const PERMISSION_METADATA: PermissionMeta[] = [
  {
    name: '组织权限',
    authority: 'organization',
    description: '组织权限的全部权限',
    children: [
      {
        name: '成员管理',
        authority: 'employee',
        permissions: [
          {
            authority: 'employee.query',
            description: '查看成员'
          },
          {
            authority: 'employee.create',
            description: '添加成员'
          },
          {
            authority: 'employee.query-detail',
            description: '编辑成员'
          },
          {
            authority: 'employee.delete',
            description: '删除成员'
          },
          {
            authority: 'tenant.set-employee-password',
            description: '重置成员密码'
          }
        ],
        description: '成员管理的全部权限',

      },
      {
        name: '角色管理',
        authority: 'role',
        permissions: [
          {
            authority: 'role.query',
            description: '查看角色'
          },
          {
            authority: 'role.create',
            description: '创建角色'
          },
          {
            authority: 'role.update',
            description: '编辑角色/权限控制'
          },
          {
            authority: 'role.delete',
            description: '删除角色'
          }
        ],
        description: '角色管理的全部权限',

      }
    ]
  },
  {
    name: '日志管理',
    authority: 'log',
    description: '日志管理的全部权限',
    children: [
      {
        name: '系统日志',
        authority: 'access-log',
        permissions: [
          {
            authority: 'access-log.query',
            description: '查看系统日志/查看系统日志详情'
          }
        ],
        description: '系统日志的全部权限',

      }
    ]
  }
];
