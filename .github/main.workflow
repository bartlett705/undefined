workflow "Master: test, build, deploy" {
  # resolves = ["Notify Deploy End", "Notify Master Start", "Deploy"]
  resolves = ["Deploy"]  
  on = "push"
}

workflow "Branch: test" {
  resolves = ["Notify Test End", "Notify Branch Start"]
  on = "push"
}

action "Filter master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

# action "Notify Master Start" {
#   needs = ["Filter master"]
#   uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
#   args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`undefined master` push received :+1: $GITHUB_SHA'"]
#   secrets = ["DC_ID", "DC_TOKEN"]
# }

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Unit Tests" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install"]
  args = "test"
}

action "Automation Tests" {
  uses = "bartlett705/npm-cy@f69478046d80aef1be0e17582c189a59bbfc9aa1"
  needs = ["Unit Tests", "Filter master"]
  args = "run cy:run"
  secrets = [
    "CONFIG_KEY",
    "CYPRESS_NEWS_API_KEY",
  ]
}

action "Deploy" {
  # needs = ["Automation Tests"]
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  args = ["POST", "https://mosey.systems/api/vanatu", "action=completed", "repository=undefined", "X-Hub-Signature:sha1=70e397d4c10930b503226e54cc5e91e291917bc7"]
}

action "Notify Deploy End" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  secrets = ["DC_ID", "DC_TOKEN"]
  needs = ["Automation Tests"]
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`undefined` Deploy Complete :tada: $GITHUB_SHA'"]
}

action "Filter not master" {
  uses = "actions/bin/filter@master"
  args = "not branch master"
}

action "Notify Branch Start" {
  needs = ["Filter not master"]
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`undefined` branch push received :+1: $GITHUB_SHA'"]
  secrets = ["DC_ID", "DC_TOKEN"]
}

action "Notify Test End" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  secrets = ["DC_ID", "DC_TOKEN"]
  needs = ["Filter not master", "Unit Tests"]
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content='`undefined` Test Complete :tada: $GITHUB_SHA'"]
}
