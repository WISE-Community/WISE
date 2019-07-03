import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectLibraryComponent } from './teacher-project-library.component';
import { MatMenuModule, MatDialog } from "@angular/material";
import { LibraryService } from "../../../services/library.service";
import { fakeAsyncResponse } from "../../../student/student-run-list/student-run-list.component.spec";

import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

export class MockLibraryService {
  setTabIndex(index: number) {
    fakeAsyncResponse(index);
  }
  tabIndexSource$ = fakeAsyncResponse(1);
}

describe('TeacherProjectLibraryComponent', () => {
  let component: TeacherProjectLibraryComponent;
  let fixture: ComponentFixture<TeacherProjectLibraryComponent>;

  beforeEach(async(() => {
    const data = Observable.create({ selectedTabIndex: 0 });
    TestBed.configureTestingModule({
      imports: [ MatMenuModule ],
      declarations: [ TeacherProjectLibraryComponent ],
      providers: [
        { provide: LibraryService, useClass: MockLibraryService },
        { provide: MatDialog },
        { provide: ActivatedRoute, useValue: { snapshot: { firstChild: { data } }} },
        { provide: Router }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherProjectLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
