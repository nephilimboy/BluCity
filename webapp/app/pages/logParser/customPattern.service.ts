import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from "rxjs";
import {CustomPattern} from "./customPattern.model";

type EntityResponseType = HttpResponse<CustomPattern>;
type EntityArrayResponseType = HttpResponse<CustomPattern[]>;

@Injectable({ providedIn: 'root' })
export class CustomPatternService {
    resourceUrl = 'http://127.0.0.1:8000/api/v1/customPattern/';
    httpHeader = new HttpHeaders({'content-type': 'application/json'});
    constructor(private http: HttpClient) {
        // this.handleError = httpErrorHandler.createHandleError('HeroesService');
    }

    query (): Observable<EntityArrayResponseType> {
        return this.http.get<CustomPattern[]>(this.resourceUrl, {headers: this.httpHeader, observe: 'response'});
    }

    create(customPattern: CustomPattern): Observable<EntityResponseType> {
        return this.http.post<CustomPattern>(this.resourceUrl, customPattern, { observe: 'response' });
    }

    update(customPattern: CustomPattern): Observable<EntityResponseType> {
        return this.http.put<CustomPattern>(this.resourceUrl + customPattern.id + '/', customPattern, { observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(this.resourceUrl + id + '/', { observe: 'response' });
    }

}