import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Billetera } from './billetera';

describe('Billetera', () => {
  let component: Billetera;
  let fixture: ComponentFixture<Billetera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Billetera],
    }).compileComponents();

    fixture = TestBed.createComponent(Billetera);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
