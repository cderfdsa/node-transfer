Proxy = require "./../proxy/index"
describe "Proxy", ->
  describe "getProxyUrl()", ->
    it "get a proxyUrl", ->
      proxy = new Proxy()
      url = proxy.getProxyUrl "/site/sysconf"
      console.log url
