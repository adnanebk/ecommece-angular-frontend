import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  uploadImage(file: File) {
    const formData = new FormData();

    formData.append('image', file);

    return this.http.post(environment.path + 'products/images', formData);
  }
}
