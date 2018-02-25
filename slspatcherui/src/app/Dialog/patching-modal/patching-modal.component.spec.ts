import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchingModalComponent } from './patching-modal.component';

describe('PatchingModalComponent', () => {
  let component: PatchingModalComponent;
  let fixture: ComponentFixture<PatchingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatchingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatchingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
