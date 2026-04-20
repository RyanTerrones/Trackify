import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'track-details/:artist/:track',
    loadComponent: () => import('./pages/track-details/track-details.page').then(m => m.TrackDetailsPage)
  },
  {
    path: 'artist-details/:name',
    loadComponent: () => import('./pages/artist-details/artist-details.page').then(m => m.ArtistDetailsPage)
  },
  {
    path: 'favourites',
    loadComponent: () => import('./pages/favourites/favourites.page').then(m => m.FavouritesPage)
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history.page').then(m => m.HistoryPage)
  },
  {
    path: 'charts',
    loadComponent: () => import('./pages/charts/charts.page').then(m => m.ChartsPage)
  },
  {
    path: 'album-details/:id',
    loadComponent: () => import('./pages/album-details/album-details.page').then(m => m.AlbumDetailsPage)
  },
  {
    path: 'genre',
    loadComponent: () => import('./pages/genre/genre.page').then(m => m.GenrePage)
  }

];
