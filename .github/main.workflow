workflow "Test, build, deploy on push" {
  on = "push"
  resolves = ["Notify in Discord", "GitHub Action for npm-1"]
}

action "Notify in Discord" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  args = ["POST", "https://discordapp.com/api/webhooks/$DC_ID/$DC_TOKEN", "username=GitHub", "content=Undefined+push+received"]
  secrets = ["DC_ID", "DC_TOKEN"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Notify in Discord"]
  args = "install"
}

action "GitHub Action for npm-1" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["GitHub Action for npm"]
  args = "test"
}
