# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.require_version ">= 1.6"

require "yaml"

# Deserialize Ansible Galaxy installation metadata for a role
def galaxy_install_info(role_name)
  role_path = File.join("deployment", "ansible", "roles", role_name)
  galaxy_install_info = File.join(role_path, "meta", ".galaxy_install_info")

  if (File.directory?(role_path) || File.symlink?(role_path)) && File.exists?(galaxy_install_info)
    YAML.load_file(galaxy_install_info)
  else
    { install_date: "", version: "0.0.0" }
  end
end

# Uses the contents of roles.yml to ensure that ansible-galaxy is run
# if any dependencies are missing
def install_dependent_roles
  ansible_roles_spec = File.join("ansible", "roles.yml")

  YAML.load_file(ansible_roles_spec).each do |role|
    role_name = role["src"]
    role_version = role["version"]
    role_path = File.join("ansible", "roles", role_name)
    galaxy_metadata = galaxy_install_info(role_name)

    if galaxy_metadata["version"] != role_version.strip
      unless system("ansible-galaxy install -f -r #{ansible_roles_spec} -p #{File.dirname(role_path)}")
        $stderr.puts "\nERROR: An attempt to install Ansible role dependencies failed."
        exit(1)
      end

      break
    end
  end
end

# Install missing role dependencies based on the contents of roles.yml
if [ "up", "provision" ].include?(ARGV.first)
  install_dependent_roles
end

ANSIBLE_ENV_GROUPS = {
  "development:children" => [
    "climate-change-lab-servers"
  ]
}
VAGRANT_NETWORK_OPTIONS = { auto_correct: false }

ANSIBLE_GROUPS = {
  "climate-change-lab-servers-servers" => [ "app" ]
}

MOUNT_OPTIONS = if Vagrant::Util::Platform.linux? then
                  ['rw', 'vers=4', 'tcp', 'nolock']
                else
                  ['vers=3', 'udp']
                end

ROOT_VM_DIR = "/opt/climate-change-lab"

Vagrant.configure("2") do |config|

  config.vm.define "app" do |app|
    app.vm.box = "ubuntu/precise64"
    app.vm.hostname = "app"
    app.vm.network "private_network", ip: ENV.fetch("CLIMATE_CHANGE_PRIVATE_IP", "192.168.8.111")

    app.vm.synced_folder '.', ROOT_VM_DIR, type: "nfs", mount_options: MOUNT_OPTIONS

    app.vm.provision "ansible" do |ansible|
      ansible.playbook = "ansible/climate-change-lab.yml"
      ansible.groups = ANSIBLE_GROUPS.merge(ANSIBLE_ENV_GROUPS)
      ansible.raw_arguments = ["--timeout=60"]
    end

    app.vm.network "forwarded_port", guest: 3100, host: 3100
    app.ssh.forward_x11 = true

    app.vm.provider :virtualbox do |v|
      v.memory = ENV.fetch("CLIMATE_CHANGE_LAB_MEM", 1024)
      v.cpus = ENV.fetch("CLIMATE_CHANGE_LAB_CPUS", 2)
    end
  end
end
