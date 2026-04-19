import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackDetailsPage } from './track-details.page';

describe('TrackDetailsPage', () => {
  let component: TrackDetailsPage;
  let fixture: ComponentFixture<TrackDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
