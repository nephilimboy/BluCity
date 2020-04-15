import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from "rxjs";
import {SrcCode, SrcElement} from "./networkGrapher.model";


type EntityResponseType = HttpResponse<SrcElement>;


@Injectable({providedIn: 'root'})
export class NetworkGrapherService {
    configUrl = 'http://127.0.0.1:8000/api/v1/grapher/';
    httpHeader = new HttpHeaders({'content-type': 'application/json'})

    // private handleError: HandleError;
    constructor(private http: HttpClient) {
        // this.handleError = httpErrorHandler.createHandleError('HeroesService');
    }

    getDiagram(): Observable<HttpResponse<any>> {
        return this.http.get<any>(this.configUrl, {headers: this.httpHeader});
    }

    parse(srcCode: SrcCode): Observable<HttpResponse<any>> {
        return this.http.post<SrcCode>(this.configUrl, srcCode, {observe: 'response'});
    }


}