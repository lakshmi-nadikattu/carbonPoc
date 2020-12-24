import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MigartiontoolComponent } from './migartiontool.component';

describe('MigartiontoolComponent', () => {
  let component: MigartiontoolComponent;
  let fixture: ComponentFixture<MigartiontoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MigartiontoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MigartiontoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
