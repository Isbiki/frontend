export const MENU_ITEMS = [{
  key: 'general',
  label: 'GENERAL',
  isTitle: true
}, {
  key: 'dashboards',
  icon: 'iconamoon:home-duotone',
  label: 'Dashboards',
},
{
  key: 'users',
  icon: 'iconamoon:profile-circle-duotone',
  label: 'Users',
  url: '/users',
},
{
  key: 'roles',
  icon: 'iconamoon:briefcase-duotone',
  label: 'Roles',
  url: '/roles',
},
{
  key: 'categories',
  icon: 'iconamoon:copy-duotone',
  label: 'Categories',
  children: [{
    key: 'main',
    label: 'Main',
    url: '/categories/main',
    parentKey: 'categories'
  }, {
    key: 'other',
    label: 'Other',
    url: '/categories/sub',
    parentKey: 'categories'
  }]
}, {
  key: 'posts',
  icon: 'iconamoon:cheque-duotone',
  label: 'Posts',
  url: '/posts',
},
]