import { nextTestSetup } from 'e2e-utils'

describe('app-dir - metadata-streaming-config', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should have the default streaming metadata config output in routes-manifest.json', async () => {
    await next.render('/')

    const routesManifest = JSON.parse(
      await next.readFile('.next/routes-manifest.json')
    )
    expect(routesManifest.streamingMetadataBotsUserAgent).toBe(
      'Googlebot|Google-PageRenderer|AdsBot-Google|googleweblight|Storebot-Google'
    )
  })
})
