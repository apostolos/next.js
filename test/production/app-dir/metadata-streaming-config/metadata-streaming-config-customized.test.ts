import { nextTestSetup } from 'e2e-utils'

describe('app-dir - metadata-streaming-config-customized', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    overrideFiles: {
      'next.config.js': `
        module.exports = {
          experimental: {
            streamingMetadataBotsUserAgent: /MyBot/i,
          }
        }
      `,
    },
  })

  it('should have the default streaming metadata config output in routes-manifest.json', async () => {
    await next.render('/')

    const routesManifest = JSON.parse(
      await next.readFile('.next/routes-manifest.json')
    )
    expect(routesManifest.streamingMetadataBotsUserAgent).toBe('MyBot')
  })
})
