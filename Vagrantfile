# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.require_version ">= 1.8"

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

ROOT_VM_DIR = "/vagrant"

Vagrant.configure("2") do |config|

  config.vm.define "app" do |app|
    app.vm.box = "ubuntu/trusty64"
    app.vm.hostname = "app"
    app.vm.network "private_network", ip: ENV.fetch("CLIMATE_CHANGE_PRIVATE_IP", "192.168.8.111")

    app.vm.synced_folder '.', ROOT_VM_DIR, type: "nfs", mount_options: MOUNT_OPTIONS
    app.vm.synced_folder "~/.aws", "/home/vagrant/.aws"

    app.vm.provision "ansible" do |ansible|
      ansible.galaxy_role_file = "deployment/ansible/roles.yml"
      ansible.playbook = "deployment/ansible/climate-change-lab.yml"
      ansible.groups = ANSIBLE_GROUPS.merge(ANSIBLE_ENV_GROUPS)
      ansible.raw_arguments = ["--timeout=60"]
    end

    app.vm.provision :shell do |shell|
      shell.inline = <<-SHELL
        grep "cd /vagrant" /home/vagrant/.bashrc || echo "cd /vagrant" >> /home/vagrant/.bashrc
      SHELL
    end

    app.vm.network "forwarded_port", guest: 4200, host: ENV.fetch("CLIMATE_CHANGE_LAB_PORT", 4200),
      auto_correct: true
    app.ssh.forward_x11 = true

    app.vm.provider :virtualbox do |v|
      v.memory = ENV.fetch("CLIMATE_CHANGE_LAB_MEM", 2048)
      v.cpus = ENV.fetch("CLIMATE_CHANGE_LAB_CPUS", 2)
    end
  end
end
