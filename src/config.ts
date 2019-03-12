enum APIEnvironment {
  Staging = 'staging',
  Production = 'production'
}

const buildType = (window as any).env as APIEnvironment
console.log('bt: ', buildType, (window as any).env)
export const config = {
  apiURI:
    buildType === APIEnvironment.Production
      ? 'https://mosey.systems/api/cli'
      : 'https://staging.mosey.systems/api/cli',
  buildType,
  newsAPIKey: '38bfc80b829e4ebf8079e2af25fcad40'
}
