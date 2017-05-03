Config = require "./../commons/config"

describe "Config", ->
  describe "get()", ->
    it "get a value", (done) ->
      config = new Config()
      config.get "api",(err,res) ->
        console.log err,res
        done()
