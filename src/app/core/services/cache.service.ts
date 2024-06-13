import {HttpEvent, HttpRequest, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of, tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    private  cachedData =new  Map<string,HttpResponse<any>>();
    private  orderPath = 'orders';
    private  creditCardPath = 'creditCards';


 applyCache(request: HttpRequest<unknown>,httpEvent$: Observable<HttpEvent<any>>) : Observable<HttpEvent<any>>{
        const pathUrl = this.getPathUrl(request.url) + request.params.toString();
        if(request.method==='GET' && this.cachedData.has(pathUrl))
          return of(this.cachedData.get(pathUrl)!);
        else if(request.method!=='GET'){
        this.clearCacheForCurrentPath(pathUrl,request.method);
        return httpEvent$;
        }
        return httpEvent$.pipe(
            tap(event => {
              if (event instanceof HttpResponse) {
                this.cachedData.set(pathUrl,event);
              }
            }))
    }
    clearCacheForCurrentPath(pathUrl: string,method: string) {
            this.cachedData.forEach((r,path) => {
                if(path.includes(pathUrl))
                    this.cachedData.delete(path);
                if (pathUrl === this.orderPath && method === 'POST')
                    this.cachedData.delete(this.creditCardPath);
            });
    }
    

private getPathUrl(url: string): string{
  return new URL(url).pathname;
   }

}
