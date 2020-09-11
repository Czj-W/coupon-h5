# 用于快速 SSH 服务器进行打包

require "net/ssh"
# require 'net/ssh/telnet'
require "pry"
require "optparse"

options = {}
option_parser = OptionParser.new do |opts|
  # 这里是这个命令行工具的帮助信息
  opts.banner = "here is help messages of the command line tool."

  # Option 作为switch，不带argument，用于将 switch 设置成 true 或 false
  options[:env] = "test"
  # 下面第一项是 Short option（没有可以直接在引号间留空），第二项是 Long option，第三项是对 Option 的描述
  opts.on("-e ENV", "--env", "Set options as environment") do |value|
    # 这个部分就是使用这个Option后执行的代码
    options[:env] = value
  end

  # Option 作为 flag，带argument，用于将argument作为数值解析，比如"name"信息
  #下面的“value”就是用户使用时输入的argument
  options[:name] = "ubuntu"
  opts.on("-n NAME", "--name Name", "Pass-in deploy name") do |value|
    options[:name] = value
  end
end.parse!

puts options.inspect

env = options[:env]
username = options[:name]

if env == "test"
  host = ["182.254.137.121"]
  build_command = "npm run build:test"
elsif env == "lianjifen"
  host = ["10.13.120.141", "115.159.39.229"]
  build_command = "npm run build"
  role = "ubuntu"
elsif env == "staging"
  host = ["10.13.7.91"]
  build_command = "npm run build:staging"
  role = "ubuntu"
else
  host = ["115.159.39.229"]
  build_command = "npm run build"
end

system("cnpm install")
system("rm -rf ./dist/")
system(build_command)
system("npm run upload")

host.each do |h|
  scp_dist = "scp -r dist/* ubuntu@#{h}:/data/projects/jifenone-manage-front"
  system(scp_dist)
end

# ssh = Net::SSH.start(host, username)
# shell = Net::SSH::Telnet.new("Session" => ssh)

# puts shell.cmd(scp_dist)

# shell.close()
