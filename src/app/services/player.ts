import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private currentTrackSubject = new BehaviorSubject<any>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private queueSubject = new BehaviorSubject<any[]>([]);

  currentTrack$ = this.currentTrackSubject.asObservable();
  isPlaying$ = this.isPlayingSubject.asObservable();
  queue$ = this.queueSubject.asObservable();

  private audio: HTMLAudioElement = new Audio();

  constructor() {
    this.audio.volume = 0.5;
    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
      this.playNext();
    });
    this.requestNotificationPermission();
  }

  async requestNotificationPermission() {
    await LocalNotifications.requestPermissions();
  }

  setQueue(tracks: any[]) {
    this.queueSubject.next(tracks);
  }

  async playTrack(track: any) {
    this.audio.pause();
    this.audio.src = track.preview;
    this.audio.play();
    this.currentTrackSubject.next(track);
    this.isPlayingSubject.next(true);

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Now Playing on Trackify',
          body: `${track.title} by ${track.artist.name}`,
          id: 1,
          schedule: { at: new Date(Date.now() + 100) },
          smallIcon: 'ic_launcher',
          iconColor: '#85d0ed'
        }
      ]
    });
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
      this.isPlayingSubject.next(true);
    } else {
      this.audio.pause();
      this.isPlayingSubject.next(false);
    }
  }

  playNext() {
    const queue = this.queueSubject.getValue();
    const current = this.currentTrackSubject.getValue();
    if (!queue.length || !current) return;
    const index = queue.findIndex(t => t.id === current.id);
    const next = queue[index + 1] || queue[0];
    this.playTrack(next);
  }

  playPrevious() {
    const queue = this.queueSubject.getValue();
    const current = this.currentTrackSubject.getValue();
    if (!queue.length || !current) return;
    const index = queue.findIndex(t => t.id === current.id);
    const prev = queue[index - 1] || queue[queue.length - 1];
    this.playTrack(prev);
  }

  getAudio(): HTMLAudioElement {
    return this.audio;
  }

  stop() {
    this.audio.pause();
    this.audio.src = '';
    this.currentTrackSubject.next(null);
    this.isPlayingSubject.next(false);
  }
}