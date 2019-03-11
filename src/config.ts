enum APIEnvironment {
  Staging = 'staging',
  Production = 'production'
}

const buildType = (window as any).env as APIEnvironment
// tslint:disable-next-line:no-console
console.log('Build Type: ', buildType, (window as any).env)
export const config = {
  apiURI:
    buildType === APIEnvironment.Production
      ? 'https://mosey.systems/api/cli'
      : 'https://staging.mosey.systems/api/cli',
  buildType,
}
