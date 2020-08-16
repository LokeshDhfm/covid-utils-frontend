import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HttpApiService {
  url = 'http://localhost:8080/';
  constructor(private readonly httpClient: HttpClient) { }


  public delete = <T = any>(
    path: string,
    myParams: HttpParams = new HttpParams()
  ): Observable<T> => {
    // const url = `${baseUrl}${path}`;
    return this.httpClient.delete<T>(this.url + path, {
      responseType: 'json'  as const,
      params: myParams ,
    });
  };


  public get<T = any>(path: string, myParams: HttpParams = new
    HttpParams()): Observable<T> {
    // const url = `${baseUrl}${path}`;
    return this.httpClient.get<T>(this.url + path, {
      responseType: 'json'  as const,
      params: myParams,
    });
  }


  public patch<T = any, U = object>(
    path: string,
    body: U,
    myParams: HttpParams = new HttpParams()
  ): Observable<T> {
    // const url = `${baseUrl}${path}`;
    return this.httpClient.patch<T>(this.url + path, body, {
      responseType: 'json'  as const,
      params: myParams,
    });
  }

  public post<T = any, U = object>(
    path: string,
    body: U,
    myParams: HttpParams = new HttpParams()
  ): Observable<T>{
    return this.httpClient.post<T>(this.url + path, body, {
      responseType: 'json' as const,
      params: myParams
    });
  }
}
