import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from "rxjs";
import {JasonParser} from "./jasonParser.model";

type EntityResponseType = HttpResponse<JasonParser>;
type EntityArrayResponseType = HttpResponse<JasonParser[]>;

@Injectable({providedIn: 'root'})
export class JasonParserService {
    resourceUrl = 'http://127.0.0.1:8000/api/v1/jasonParser/';
    httpHeader = new HttpHeaders({'content-type': 'application/json'});

    private messageSource = new BehaviorSubject(new Map<string, string>());
    public jasonDataBetweenDynamicComponentAndParrent = this.messageSource.asObservable();


    constructor(private http: HttpClient) {
    }

    query(): Observable<EntityArrayResponseType> {
        return this.http.get<JasonParser[]>(this.resourceUrl, {headers: this.httpHeader, observe: 'response'});
    }

    create(jasonParser: JasonParser): Observable<EntityResponseType> {
        return this.http.post<JasonParser>(this.resourceUrl, jasonParser, {observe: 'response'});
    }

    update(jasonParser: JasonParser): Observable<EntityResponseType> {
        return this.http.put<JasonParser>(this.resourceUrl + jasonParser.id + '/', jasonParser, {observe: 'response'});
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(this.resourceUrl + id + '/', {observe: 'response'});
    }

    updateJasonDataBetweenAllSharedComponents(message: Map<string, string>) {
        this.messageSource.next(message)
    }

}