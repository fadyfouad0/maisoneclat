import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'hnoq2gu0',
    dataset: 'production'
  },
  studioHost: 'maison-eclat',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    appId: 'wkj9y0eoqr9he8hfs6ylx9ow',
    autoUpdates: true,
  },
})
