# Pin fastlane + cocoapods so deploys are reproducible. Ran into Homebrew
# fastlane wrapper hangs on couple-tools after a Ruby upgrade; running
# fastlane via `bundle exec` under rbenv Ruby (>= 3.2) avoids that whole
# class of issue.
source "https://rubygems.org"

gem "fastlane", "~> 2.232.1"
gem "cocoapods", "~> 1.16"
