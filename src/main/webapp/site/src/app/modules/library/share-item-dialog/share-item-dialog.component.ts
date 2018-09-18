import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { TeacherService } from "../../../teacher/teacher.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { map, debounceTime } from 'rxjs/operators';
import { Project } from "../../../domain/project";

@Component({
  selector: 'app-share-item-dialog',
  templateUrl: './share-item-dialog.component.html',
  styleUrls: ['./share-item-dialog.component.scss']
})
export abstract class ShareItemDialogComponent implements OnInit {

  project: Project;
  projectId: number;
  runId: number;
  teacherSearchControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  sharedOwners: any[] = [];

  constructor(public dialogRef: MatDialogRef<ShareItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public teacherService: TeacherService) {
    this.teacherService.retrieveAllTeacherUsernames().subscribe((teacherUsernames) => {
      this.options = teacherUsernames;
    })
  }

  ngOnInit() {
    this.filteredOptions = this.teacherSearchControl.valueChanges.pipe(
      debounceTime(1000),
      map(value => this._filter(value))
    );
  }

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (filterValue == '') {
      return [];
    }
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  populateSharedOwners(sharedOwners) {
    for (let sharedOwner of sharedOwners) {
      const localSharedOwner = JSON.parse(JSON.stringify(sharedOwner));
      this.populatePermissions(localSharedOwner);
      delete localSharedOwner.permissions;
      this.sharedOwners.push(localSharedOwner);
    }
  }

  abstract populatePermissions(sharedOwner);

  addProjectPermissions(sharedOwner) {
    this.setDefaultProjectPermissions(sharedOwner);
    const sharedProjectOwner = this.getSharedProjectOwner(sharedOwner.id, this.project);
    for (let permission of sharedProjectOwner.permissions) {
      sharedOwner.projectPermissions[permission] = true;
    }
  }

  abstract setDefaultProjectPermissions(sharedOwner);

  getSharedProjectOwner(userId, item) {
    for (let sharedOwner of item.sharedOwners) {
      if (sharedOwner.id == userId) {
        return sharedOwner;
      }
    }
    return { permissions: [] };
  }

  getSharedOwner(sharedOwnerId): any {
    for (let sharedOwner of this.sharedOwners) {
      if (sharedOwner.id == sharedOwnerId) {
        return sharedOwner;
      }
    }
    return { permissions: [] };
  }

  projectPermissionChanged(project, sharedOwnerId, permissionId, isAddingPermission) {
    if (isAddingPermission) {
      this.teacherService.addSharedOwnerProjectPermission(project.id, sharedOwnerId, permissionId)
        .subscribe((response: any) => {
          if (response.status == "success") {
            this.addProjectPermissionToSharedOwner(sharedOwnerId, permissionId);
          }
        })
    } else {
      this.teacherService.removeSharedOwnerProjectPermission(project.id, sharedOwnerId, permissionId)
        .subscribe((response: any) => {
          if (response.status == "success") {
            this.removeProjectPermissionFromSharedOwner(sharedOwnerId, permissionId);
          }
        })
    }
  }

  addProjectPermissionToSharedOwner(sharedOwnerId, permissionId) {
    const sharedOwner = this.getSharedOwner(sharedOwnerId);
    sharedOwner.projectPermissions[permissionId] = true;
  }

  removeProjectPermissionFromSharedOwner(sharedOwnerId, permissionId) {
    const sharedOwner = this.getSharedOwner(sharedOwnerId);
    sharedOwner.projectPermissions[permissionId] = false;
  }

  isSharedOwner(username) {
    for (let sharedOwner of this.sharedOwners) {
      if (sharedOwner.username == username) {
        return true;
      }
    }
    return false;
  }

  removeSharedOwner(sharedOwner) {
    for (let i = 0; i < this.sharedOwners.length; i ++) {
      if (this.sharedOwners[i].id == sharedOwner.id) {
        this.sharedOwners.splice(i, 1);
        return;
      }
    }
  }
}
