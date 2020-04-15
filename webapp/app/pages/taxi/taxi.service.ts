import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from "rxjs";


// type EntityResponseType = HttpResponse<SrcElement>;


@Injectable({providedIn: 'root'})
export class TaxiService {
    configUrl = 'http://127.0.0.1:8000/api/v1/taxi/';
    httpHeader = new HttpHeaders({'content-type': 'application/json'})
    //
    // // private handleError: HandleError;
    constructor(private http: HttpClient) {
        // this.handleError = httpErrorHandler.createHandleError('HeroesService');
    }
    //
    get(): Observable<HttpResponse<any>> {
        return this.http.get<any>(this.configUrl, {headers: this.httpHeader});
        // return null;
    }

    getTimeStampData(timestamp: number): Observable<HttpResponse<any>> {
        return this.http.post<number>(this.configUrl + timestamp + '/', timestamp, {observe: 'response'});
    }


}