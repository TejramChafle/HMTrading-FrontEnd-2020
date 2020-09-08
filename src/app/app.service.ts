import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

// import { AppService } from 'src/app/app.service';
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
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    // tslint:disable-next-line: variable-name

    printContentHeader: string;
    printContentFooter: string;

    constructor(private _http: HttpClient, private _modelService: NgbModal, private _router: Router) {
        this.printContentHeader = `
        <html>
            <head>
                <title></title>
                <!-- Bootstrap 3.0 -->
                <!-- Latest compiled and minified CSS -->
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
                <style>
                    @media all {
                        table, td, th {
                            border: 1px gray;
                            border-collapse: collapse;
                        }
                        .bg-dark{ background-color: gray!important; color: #ebdef0 !important}
                        /* Print Page CSS */
                        .print-footer, .print-header {
                            border: 1px solid #76d7c4;
                        }
                        
                        .header-trapezoid {
                            border-bottom: 210px solid #76d7c4;
                            height: 210px;
                            border-left: 60px solid transparent;
                            width: 50%;
                            display: inline-block;
                            color: white;
                        }
                        
                        .header-trapezoid > h1 {
                            line-height: 210px;
                        }
                        
                        .footer-trapezoid {
                            border-bottom: 60px solid #76d7c4;
                            height: 60px;
                            border-left: 25px solid transparent;
                            width: 50%;
                            display: inline-block;
                            color: white;
                        }
                        
                        .footer-trapezoid > p {
                            color: white;
                            line-height: 50px;
                        }
                        
                        .print-terms {
                            padding-left: 15px;
                            width: 50%;
                            height: 60px;
                            text-align: left;
                            word-wrap: break-word;
                            display: inline-block;
                        }
                        
                        .biller-info {
                            padding: 20px 0 0 20px;
                            width: 50%;
                            height: 210px;
                            text-align: left;
                            word-wrap: break-word;
                            display: inline-block;
                        }
                        
                        .print-page {
                            width: 100%;
                            /* overflow-y:scroll; */
                            padding: 25px;
                            /* overflow-x: auto; */
                        }
                        
                        .modal-lg {
                            /* max-width: 1000px !important; */
                            max-width: 80% !important;
                        }
                        
                        
                        .page-header-message > span {
                            display: inline-block;
                            padding: .375rem .75rem;
                            font-size: 1rem;
                            line-height: 1.5;
                            font-weight: bold;
                            background: #76d7c4;
                            vertical-align: middle;
                        }
                        
                        .hm-trading-message {
                            color: #76d7c4;
                        }
                        .hmtrading-text-right {
                            text-align: right !important;
                        }

                        .print-logo {
                            float: left; height: 150px; margin-right: 20px;
                        }
                    }
                </style>
            </head>
            <body onload='window.print();window.close()'>`;
        this.printContentFooter = `</body></html>`;    
    }

    login(credential): Observable<any> {
        return this._http.post(baseUrl + 'Login/signIn', credential, httpOptions).pipe(
            // retry(3),
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
        // console.log(error);
        if (error.status === 500) {
            // const modelRef = this._modelService.open(AlertComponent, { size: 'lg' });
            // modelRef.componentInstance.error = error.error;
            // modelRef.componentInstance.type = error.type || 'Error!';
        } else if (error.status == 200) {
            const modelRef = this._modelService.open(AlertComponent, { size: 'lg', centered: true });
            modelRef.componentInstance.error = error.error.text;
            modelRef.componentInstance.type = error.error.message || 'Error!';
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

    capitalizeFirstLetter(string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    GetFormattedDate(date): string {
        var todayTime = new Date(date);
        var month = todayTime.getMonth() + 1;
        var day = todayTime.getDate();
        var year = todayTime.getFullYear();
        let result =  day.toString() + "/" + month.toString() + "/" + year.toString();
        return result.toString();
    }

    GetWordFormattedDate(date): string {
        var todayTime = new Date(date.replace(' ', 'T'));
        var month = todayTime.getMonth() + 1;
        var day = todayTime.getDate();
        var year = todayTime.getFullYear();
        let daystr = day <=9 ? '0'+day.toString() : day.toString();
        let result = daystr + " " + this.months[month-1] + ", " + year.toString();
        return result.toString();
    }

    GetWordFormattedMonth(date): String {
        var todayTime = new Date(date.replace(' ', 'T'));
        var month = todayTime.getMonth() + 1;
        var year = todayTime.getFullYear();
        let result = this.months[month-1] + ", " + year.toString();
        // console.log(result, result.toString());
        return result.toString();
    }
}
