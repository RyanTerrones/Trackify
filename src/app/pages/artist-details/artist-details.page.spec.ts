import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistDetailsPage } from './artist-details.page';

describe('ArtistDetailsPage', () => {
  let component: ArtistDetailsPage;
  let fixture: ComponentFixture<ArtistDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
