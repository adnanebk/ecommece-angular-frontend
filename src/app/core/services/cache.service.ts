import {HttpEvent, HttpRequest, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of, tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    private  cachedData =new  Map<string,HttpResponse<any>>();
    private  orderPath = '/api/orders';
    private  creditCardPath = '/api/creditCards';


 applyCache(request: HttpRequest<unknown>,httpEvent$: Observable<HttpEvent<any>>) : Observable<HttpEvent<any>>{
        const pathUrl = this.getPathUrl(request.url) + request.params.toString();
        if(request.method==='GET' && this.cachedData.has(pathUrl))
          return of(this.cachedData.get(pathUrl)!);
        else if(request.method!=='GET'){
        this.clearCache(pathUrl,request.method);
        return httpEvent$;
        }
        return httpEvent$.pipe(
            tap(event => {
              if (event instanceof HttpResponse) {
                this.cachedData.set(pathUrl,event);
              }
            }))
    }
    clearCache(pathUrl: string, method: string) {
            this.cachedData.forEach((r,path) => {
                pathUrl = pathUrl.replace(/(\/api\/[^\/]+)\/.*/, '$1');
                if(path.includes(pathUrl))
                    this.cachedData.delete(path);
                if (this.orderPath.includes(pathUrl) && method === 'POST')
                    this.cachedData.delete(this.creditCardPath);
            });
    }
    

private getPathUrl(url: string): string{
  return new URL(url).pathname;
   }

}
