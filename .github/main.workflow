workflow "Test, build, deploy on push" {
  resolves = ["Notify Start", "Notify Deploy End", "Notify Test End"]
  on = "push"
}

action "Notify Start" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`undefined` push received :+1: $GITHUB_SHA'"]
  secrets = ["DC_ID", "DC_TOKEN"]
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Unit Tests" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install"]
  args = "test"
}

action "Master" {
  needs = ["Unit Tests"]
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Automation Tests" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Master"]
  args = "run cy:run"
  secrets = [
    "CONFIG_KEY",
    "CYPRESS_NEWS_API_KEY",
  ]
}

action "Deploy" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Automation Tests"]
  args = "run deploy:ci"
  secrets = ["CONFIG_KEY", "CONFIG_IV"]
}

action "Notify Deploy End" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  secrets = ["DC_ID", "DC_TOKEN"]
  needs = ["Deploy"]
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`undefined` Deploy Complete :tada: $GITHUB_SHA'"]
}

action "Not Master" {
  needs = ["Unit Tests"]
  uses = "actions/bin/filter@master"
  args = "not branch master"
}

action "Notify Test End" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  secrets = ["DC_ID", "DC_TOKEN"]
  needs = ["Not Master"]
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`undefined` Test Complete :tada: $GITHUB_SHA'"]
}
