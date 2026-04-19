import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storageReady = false;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
    this.storageReady = true;
  }

  async saveFavourite(item: any) {
    const favourites = await this.getFavourites();
    favourites.push(item);
    await this.storage.set('favourites', favourites);
  }

  async getFavourites(): Promise<any[]> {
    const favourites = await this.storage.get('favourites');
    return favourites || [];
  }

  async removeFavourite(id: string) {
    const favourites = await this.getFavourites();
    const updated = favourites.filter(item => item.id !== id);
    await this.storage.set('favourites', updated);
  }

  async isFavourite(id: string): Promise<boolean> {
    const favourites = await this.getFavourites();
    return favourites.some(item => item.id === id);
  }

  async saveSearchHistory(query: string) {
    const history = await this.getSearchHistory();
    const updated = [query, ...history.filter(q => q !== query)].slice(0, 20);
    await this.storage.set('searchHistory', updated);
  }

  async getSearchHistory(): Promise<string[]> {
    const history = await this.storage.get('searchHistory');
    return history || [];
  }

  async clearSearchHistory() {
    await this.storage.set('searchHistory', []);
  }

  async saveRating(trackId: string, rating: number) {
    await this.storage.set(`rating_${trackId}`, rating);
  }

  async getRating(trackId: string): Promise<number> {
    const rating = await this.storage.get(`rating_${trackId}`);
    return rating || 0;
  }
}