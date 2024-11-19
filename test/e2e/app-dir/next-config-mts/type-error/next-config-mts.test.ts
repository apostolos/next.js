import { nextTestSetup } from 'e2e-utils'

describe('next-config-ts - type error (next.config.mts)', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
    skipStart: true,
  })

  it('should throw with type error on build (next.config.mts)', async () => {
    if (isNextDev) {
      await next.start()
      const $ = await next.render$('/')
      expect($('p').text()).toBe('foo')
    } else {
      const { cliOutput } = await next.build()
      await expect(cliOutput).toContain(
        `Type error: Type 'string' is not assignable to type 'number'.`
      )
    }
  })
})
