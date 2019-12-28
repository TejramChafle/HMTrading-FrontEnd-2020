import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

// import { AppService } from '../../app.service';
import { baseUrl } from './app.config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './components/alert/alert.component';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    })
};

@Injectable({
    providedIn: 'root'
})

export class AppService {
    agent: any;
    agents: Array<any>;
    items: Array<any>;
    isDrawDashboard: Boolean = true;

    // tslint:disable-next-line: variable-name
    constructor(private _http: HttpClient, private _modelService: NgbModal, private _router: Router) {
    }

    login(credential): Observable<any> {
        return this._http.post(baseUrl + 'Login/signIn', credential, httpOptions).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                // this._appService.handleError(error);
                return throwError(error);
            })
        );
    }

    // Display the application level alert messages
    notify(message: string, type?: string) {
        // this._appService.notify(message);
        const modelRef = this._modelService.open(AlertComponent, { centered: true, size: 'sm' });
        modelRef.componentInstance.message = message;
        modelRef.componentInstance.type = type || 'Alert!';
    }

    handleError(error) {

        if (error.status === 500) {
            const modelRef = this._modelService.open(AlertComponent, { size: 'lg' });
            modelRef.componentInstance.error = error.error;
            modelRef.componentInstance.type = error.type || 'Error!';
        } else {
            const modelRef = this._modelService.open(AlertComponent, { centered: true, size: 'sm' });
            modelRef.componentInstance.message = error.message;
            modelRef.componentInstance.type = error.type || 'Error!';
        }
    }


    logout() {
        // this.loggedIn.next(false);
        localStorage.clear();
        this._router.navigate(['login']);
    }

    // Return logged in status
    get isLoggedIn() {
        if (localStorage.getItem('user')) {
            return true;
        } else {
            return false;
        }
    }


    /*-----------------------------------------------------------------------------------------*/
    /* PRINT HELER FUNCTIONS*/
    /*-----------------------------------------------------------------------------------------*/

    inWords(num): String {
        var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        if ((num = num.toString()).length > 9) return 'overflow';
        let n = [];
        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
        return str;
    }

    capitalizeFirstLetter(string): String {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    GetFormattedDate(date) {
        var todayTime = new Date(date);
        var month = todayTime.getMonth() + 1;
        var day = todayTime.getDate();
        var year = todayTime.getFullYear();
        return day + "/" + month + "/" + year;
    }
}
