import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {
  }

  uploadImage(file: File) {
    const type = file.type.toLowerCase();
    if (!type.endsWith('jpeg') && !type.endsWith('jpg') && !type.endsWith('png')) {
      return throwError('File must be an image of types jpg or jpeg or png');
    }
    const formData = new FormData();

    formData.append('image', file);

    return this.http.post(environment.path + 'products/images', formData, {responseType: 'text'})
      .pipe(map(res=>environment.path + 'products/images/'+res));
  }
}
