import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private translations: any = {
    en: {
      home: 'Home',
      charts: 'Charts',
      favourites: 'Favourites',
      history: 'History',
      settings: 'Settings',
      trackOfDay: 'Track of the Day',
      artistOfDay: 'Artist of the Day',
      discovery: 'Discovery',
      search: 'Search tracks or artists...',
      topTracks: 'Top Tracks',
      topArtists: 'Top Artists',
      about: 'About',
      listeners: 'Listeners',
      plays: 'plays',
      fans: 'fans',
      albums: 'Albums',
      tags: 'Tags',
      yourRating: 'Your Rating',
      tracks: 'Tracks',
      artists: 'Artists',
      listenNow: 'Listen Now',
      viewArtist: 'View Artist',
      playPreview: 'Play Preview',
      pause: 'Pause',
      noFavourites: 'No Favourites Yet',
      noFavouritesDesc: 'Start adding tracks and artists to your favourites',
      noHistory: 'No Search History',
      noHistoryDesc: 'Your recent searches will appear here',
      clearAll: 'Clear All',
      released: 'Released',
      aboutTrack: 'About this Track',
      topTracks2: 'Top Tracks',
      deezerCharts: 'Deezer Charts',
      clearAllData: 'Clear All Data',
      developer: 'Developer',
      apisUsed: 'APIs Used',
      college: 'College',
      version: 'Version',
      theme: 'Theme',
      language: 'Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode'
    },
    ga: {
      home: 'Baile',
      charts: 'Cairteacha',
      favourites: 'Ceanáin',
      history: 'Stair',
      settings: 'Socruithe',
      trackOfDay: 'Rian an Lae',
      artistOfDay: 'Ealaíontóir an Lae',
      discovery: 'Fionnachtain',
      search: 'Cuardaigh rainn nó ealaíontóirí...',
      topTracks: 'Na Rainn is Fearr',
      topArtists: 'Na hEalaíontóirí is Fearr',
      about: 'Maidir le',
      listeners: 'Éisteoirí',
      plays: 'seinnte',
      fans: 'lucht leanúna',
      albums: 'Albaim',
      tags: 'Clibeanna',
      yourRating: 'Do Mharcáil',
      tracks: 'Rainn',
      artists: 'Ealaíontóirí',
      listenNow: 'Éist Anois',
      viewArtist: 'Féach ar Ealaíontóir',
      playPreview: 'Seinn Réamhamharc',
      pause: 'Cuir ar Sos',
      noFavourites: 'Gan Ceanáin Fós',
      noFavouritesDesc: 'Tosaigh ag cur rainn agus ealaíontóirí le do cheanáin',
      noHistory: 'Gan Stair Cuardaigh',
      noHistoryDesc: 'Beidh do chuardaigh le déanaí le feiceáil anseo',
      clearAll: 'Glan Gach Rud',
      released: 'Eisithe',
      aboutTrack: 'Maidir leis an Rian',
      topTracks2: 'Na Rainn is Fearr',
      deezerCharts: 'Cairteacha Deezer',
      clearAllData: 'Glan Gach Sonra',
      developer: 'Forbróir',
      apisUsed: 'APIanna Úsáidte',
      college: 'Coláiste',
      version: 'Leagan',
      theme: 'Téama',
      language: 'Teanga',
      darkMode: 'Mód Dorcha',
      lightMode: 'Mód Éadrom'
    },
    es: {
      home: 'Inicio',
      charts: 'Listas',
      favourites: 'Favoritos',
      history: 'Historial',
      settings: 'Ajustes',
      trackOfDay: 'Canción del Día',
      artistOfDay: 'Artista del Día',
      discovery: 'Descubrimiento',
      search: 'Buscar canciones o artistas...',
      topTracks: 'Canciones Principales',
      topArtists: 'Artistas Principales',
      about: 'Acerca de',
      listeners: 'Oyentes',
      plays: 'reproducciones',
      fans: 'fans',
      albums: 'Álbumes',
      tags: 'Etiquetas',
      yourRating: 'Tu Valoración',
      tracks: 'Canciones',
      artists: 'Artistas',
      listenNow: 'Escuchar Ahora',
      viewArtist: 'Ver Artista',
      playPreview: 'Reproducir Vista Previa',
      pause: 'Pausar',
      noFavourites: 'Sin Favoritos Aún',
      noFavouritesDesc: 'Empieza a añadir canciones y artistas a tus favoritos',
      noHistory: 'Sin Historial de Búsqueda',
      noHistoryDesc: 'Tus búsquedas recientes aparecerán aquí',
      clearAll: 'Borrar Todo',
      released: 'Lanzado',
      aboutTrack: 'Sobre esta Canción',
      topTracks2: 'Canciones Principales',
      deezerCharts: 'Listas de Deezer',
      clearAllData: 'Borrar Todos los Datos',
      developer: 'Desarrollador',
      apisUsed: 'APIs Utilizadas',
      college: 'Universidad',
      version: 'Versión',
      theme: 'Tema',
      language: 'Idioma',
      darkMode: 'Modo Oscuro',
      lightMode: 'Modo Claro'
    }
  };

  private currentLanguageSubject = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  setLanguage(code: string) {
    this.currentLanguageSubject.next(code);
  }

  translate(key: string): string {
    const lang = this.currentLanguageSubject.getValue();
    return this.translations[lang]?.[key] || this.translations['en'][key] || key;
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.getValue();
  }
}