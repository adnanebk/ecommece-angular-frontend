import { HttpEvent, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    private  cachedData =new  Map<string,HttpResponse<any>>();
    private  pathPattern = /\/api\/([^\/]+)\/?/;
    private  orderPath = 'orders';
    private  creditCardPath = 'creditCards';


 applyCache(request: HttpRequest<unknown>,httpEvent$: Observable<HttpEvent<any>>) : Observable<HttpEvent<any>>{
        const pathUrl = this.getPathUrl(request.url) + this.getPageNumberIfPageable(request.params);
        if(request.method==='GET' && this.cachedData.has(pathUrl))
          return of(this.cachedData.get(pathUrl)!);
        else if(request.method!=='GET'){
        this.clearCacheForCurrentPath(pathUrl,request.method);
        return httpEvent$;
        }
        return httpEvent$.pipe(
            tap(event => {
              if (event instanceof HttpResponse) {
                const pageNum = event.body?.number;
                this.cachedData.set(this.getPathUrl(request.url)+(pageNum!==undefined?pageNum:''),event);
              }
            }))
    }
    clearCacheForCurrentPath(pathUrl: string,method: string) {
         setTimeout(() => {
            this.cachedData.forEach((r,path) => {
                if(path.includes(pathUrl))
                    this.cachedData.delete(path);
                if (pathUrl === this.orderPath && method === 'POST')
                    this.cachedData.delete(this.creditCardPath);
            });
        });
    }
    getPageNumberIfPageable(params: HttpParams): string {
        if(params && params.has('number'))
         return params.get('number')!;
        return ''; 
    }



private getPathUrl(url: string): string{
    const match = url.match(this.pathPattern);
    return match && match[1] || '';
   }

}
