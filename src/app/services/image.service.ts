import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  uploadImage(file: File) {
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('jpeg') || !fileName.endsWith('png')) {
      return throwError('File must be an image of jpeg or png');
    }
    const formData = new FormData();

    formData.append('image', file);

    return this.http.post(environment.path + 'products/images', formData);
  }
}
