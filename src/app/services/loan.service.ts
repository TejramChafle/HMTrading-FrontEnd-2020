import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import { AppService } from '../app.service';
import { baseUrl } from '../app.config';

const options = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    })
};

@Injectable({
    providedIn: 'root'
})

export class LoanService {

    // tslint:disable-next-line:variable-name
    constructor(private _http: HttpClient, private _appService: AppService) { }

    // get the all the loan customers from sever
    public getLoanCustomers(params): Observable<any> {

        return this._http.post(baseUrl + 'Customer/get_loan_customers', params, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    // get the customer on sever for specified id
    public getLoanCustomer(id): Observable<any> {

        return this._http.get(baseUrl + 'Customer/get_loan_customer_detail?customer_id=' + id, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    // Add the add customer form data and create the new customer on sever
    public addLoanCustomer(data): Observable<any> {

        return this._http.post(baseUrl + 'Customer/add_loan_customer', data, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }

    // Delete the loan customer form data
    public deleteLoanCustomer(data): Observable<any> {

        return this._http.post(baseUrl + 'Customer/delete_loan_customer', data, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }

    /*  -------------------------------------------------------------------------------------------
    | The following functions deals with the Loan module of the project
    -------------------------------------------------------------------------------------------  */

    public getTransactions(params): Observable<any> {

        return this._http.post(baseUrl + 'Transactions/get_loan_transactions/', params, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }



    public addLoanInstallment(params): Observable<any> {

        return this._http.post(baseUrl + 'Transactions/add_loan_installment', params, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    public createLoanAccount(params): Observable<any> {

        return this._http.post(baseUrl + 'Transactions/create_loan_account', params, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    public getLoanInstallments(params): Observable<any> {

        return this._http.post(baseUrl + 'Installments/get_loan_installments', params, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }

    public saveLoanInterest(params): Observable<any> {

        return this._http.post(baseUrl + 'Transactions/save_loan_interest', params, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    public getStatistics(params): Observable<any> {

        return this._http.post(baseUrl + 'Transactions/reports', params, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }

    public getInstallmentHistory(params): Observable<any> {

        return this._http.post(baseUrl + 'Installments/get_installment_history', params, options).pipe(
            retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }

}
