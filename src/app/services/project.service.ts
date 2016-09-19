import { Injectable } from '@angular/core';

import { Project } from '../models/project';

@Injectable()
export class ProjectService {

    private storageKey: string = 'cclab.projects';
    private projects: Project[] = [];
    private storage: Storage = window.localStorage;

    constructor() {
        this.projects = JSON.parse(this.storage.getItem(this.storageKey)) || [];
    }

    add(project: Project) {
        this.projects.push(project);
        this.save();
    }

    list(): Project[] {
        return this.projects;
    }

    remove(project: Project) {
        this.projects = this.projects.filter(function(p) {
            return p.id !== project.id;
        });
        this.save();
    }

    update(project: Project) {
        let index = this.projects.findIndex(p => p.id === project.id);
        this.projects[index] = project;
        this.save();
    }

    private save() {
        this.storage.setItem(this.storageKey, JSON.stringify(this.projects));
    }
}