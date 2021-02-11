import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedImageComponent } from './processed-image.component';

describe('ProcessedImageComponent', () => {
  let component: ProcessedImageComponent;
  let fixture: ComponentFixture<ProcessedImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessedImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
