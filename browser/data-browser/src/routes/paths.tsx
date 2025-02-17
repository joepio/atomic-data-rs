export const pathNames = {
  // Main app route
  app: '/app',
  // sub routes
  agentSettings: '/agent',
  appSettings: '/settings',
  serverSettings: '/server',
  new: '/new',
  shortcuts: '/shortcuts',
  search: '/search',
  share: '/share',
  show: '/show',
  token: '/token',
  data: '/data',
  edit: '/edit',
  about: '/about',
  import: '/import',
  history: '/history',
  allVersions: '/all-versions',
  sandbox: '/sandbox',
  fetchBookmark: '/fetch-bookmark',
  pruneTests: '/prunetests',
} as const;
export const paths = {
  agentSettings: `${pathNames.app}${pathNames.agentSettings}`,
  appSettings: `${pathNames.app}${pathNames.appSettings}`,
  serverSettings: `${pathNames.app}${pathNames.serverSettings}`,
  new: `${pathNames.app}${pathNames.new}`,
  shortcuts: `${pathNames.app}${pathNames.shortcuts}`,
  search: `${pathNames.app}${pathNames.search}`,
  share: `${pathNames.app}${pathNames.share}`,
  show: `${pathNames.app}${pathNames.show}`,
  token: `${pathNames.app}${pathNames.token}`,
  data: `${pathNames.app}${pathNames.data}`,
  edit: `${pathNames.app}${pathNames.edit}`,
  about: `${pathNames.app}${pathNames.about}`,
  import: `${pathNames.app}${pathNames.import}`,
  history: `${pathNames.app}${pathNames.history}`,
  allVersions: `${pathNames.app}${pathNames.allVersions}`,
  sandbox: `${pathNames.app}${pathNames.sandbox}`,
  fetchBookmark: pathNames.fetchBookmark,
  pruneTests: `${pathNames.app}${pathNames.pruneTests}`,
} as const;
