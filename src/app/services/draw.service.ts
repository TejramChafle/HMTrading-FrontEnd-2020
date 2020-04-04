import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, delay } from 'rxjs/operators';

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

export class DrawService {
    // Save the scheme installments
    schemeInstallments: any;

    // tslint:disable-next-line:variable-name
    constructor(private _http: HttpClient, private _appService: AppService) {
        console.log('saved installments', JSON.parse(localStorage.getItem('schemeInstallments')));
    }

    // Get the agents in silent/background
    agents() {
        this.getCustomers({ is_agent_too: 1, limit: 1000, offset: 0, page: 1 }).subscribe(
            data => {
                console.log(data);
                this._appService.agents = data.records;
            },
            error => {
                this._appService.notify('Oops! Unable to get the agents information.', 'Error!');
                console.log(error);
            });
    }

    addCustomer(data): Observable<any> {
        return this._http.post(baseUrl + 'Customer/add_customer', data, options).pipe(
            // // retry(3),
            map((response) => {
                return response;
            }), catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }

    // get the all the customers from sever
    public getCustomers(params): Observable<any> {
        return this._http.post(baseUrl + 'Customer/get_customers', params, options).pipe(
            delay(3000),
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
    public getCustomer(id): Observable<any> {

        return this._http.get(baseUrl + 'Customer/get_customer_detail?customer_id=' + id, options).pipe(
            delay(3000),
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
    public deleteCustomer(id): Observable<any> {

        return this._http.get(baseUrl + 'Customer/delete_customer_detail?customer_id=' + id, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    // get all the installments of all the customers
    public getInstallments(params): Observable<any> {
        return this._http.post(baseUrl + 'Installments/get_installments', params, options).pipe(
            delay(3000),
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


    // update the installment of customer
    public updateInstallment(params): Observable<any> {
        return this._http.post(baseUrl + 'Installments/update_installment', params, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    // update the installment of customer
    public addInstallment(params): Observable<any> {
        return this._http.post(baseUrl + 'Installments/add_installment', params, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }



    // get all the installments of all the customers
    public getInstallmentsOfSelectedCustomers(params): Observable<any> {
        return this._http.post(baseUrl + 'Installments/get_installments_of_selected_customers', params, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }



    public luckDraw(params): Observable<any> {
        return this._http.post(baseUrl + 'Installments/lucky_draw', params, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    public saveLuckyCustomer(params): Observable<any> {
        return this._http.post(baseUrl + 'Installments/save_lucky_customer', params, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    public luckyCustomers(): Observable<any> {
        return this._http.get(baseUrl + 'Installments/lucky_customers', options).pipe(
            delay(3000),
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



    public getPayments(params): Observable<any> {
        return this._http.post(baseUrl + 'Installments/payments/', params, options).pipe(
            delay(3000),
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
    public addItem(data): Observable<any> {
        return this._http.post(baseUrl + 'Items/add_item', data, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    // get all the items in scheme
    public getItems(params): Observable<any> {
        return this._http.post(baseUrl + 'Items/get_items', params, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }

    // Delete the item of the specified id
    public deleteItem(id): Observable<any> {
        return this._http.get(baseUrl + 'Items/delete_item?item_id=' + id, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    // Delete the item of the specified id
    public getItem(id): Observable<any> {
        return this._http.get(baseUrl + 'Items/get_item_detail?item_id=' + id, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }



    // get all the schemes in scheme
    public getSchemes(): Observable<any> {
        return this._http.get(baseUrl + 'Schemes/get_schemes', options).pipe(
            delay(3000),
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


    // Add the add scheme form data and create the new scheme on sever
    public addScheme(data): Observable<any> {
        return this._http.post(baseUrl + 'Schemes/add_scheme', data, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    // get the scheme on sever for specified id
    public getScheme(id): Observable<any> {
        return this._http.get(baseUrl + 'Schemes/get_scheme_detail?scheme_id=' + id, options).pipe(
            delay(3000),
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


    // get the scheme on sever for specified id
    public deleteScheme(id): Observable<any> {
        return this._http.get(baseUrl + 'Schemes/delete_scheme_detail?scheme_id=' + id, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    // get all the scheme installments for the specified scheme id
    public getSchemeInstallments(params): Observable<any> {
        return this._http.get(baseUrl + 'Schemes/get_scheme_installments?scheme_id=' + params, options).pipe(
            delay(3000),
            retry(3),
            map((response) => {
                // Save the scheme installment to avoid future requests
                this.schemeInstallments = response;
                localStorage.setItem('schemeInstallments', JSON.stringify(this.schemeInstallments));
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }

    // Get the items distribution count
    public itemDistribution(params): Observable<any> {
        return this._http.post(baseUrl + 'Items/get_item_distribution', params, options).pipe(
            delay(2000),
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

    // Get the items distribution count
    public initDashboard(): Observable<any> {
        return this._http.post(baseUrl + 'Schemes/db_summaries', options).pipe(
            delay(3000),
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


    // Get the list of pending installments of the provided month
    public getPendingInstallments(params): Observable<any> {
        return this._http.post(baseUrl + 'Installments/get_pending_installments', params, options).pipe(
            delay(3000),
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



    /*---------------------------------------------------------------------------------------
        : GET message deleivery report from text-local server
    ----------------------------------------------------------------------------------------*/
    public smsCredit(): Observable<any> {
        return this._http.get(baseUrl + 'Schemes/check_message_credit', options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }



    /*---------------------------------------------------------------------------------------
        : GET message credit available from textlocal.in
    ----------------------------------------------------------------------------------------*/
    public smsReport(params: any = {}): Observable<any> {
        return this._http.post(baseUrl + 'Schemes/messages_report', params, options).pipe(
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }


    /*---------------------------------------------------------------------------------------
        : SEND NOTIFICATION to the customers for pending installment
    ----------------------------------------------------------------------------------------*/
    public sendNotification(params): Observable<any> {
        return this._http.post(baseUrl + 'Installments/send_notification_to_pending_installments', params, options).pipe(
            // retry(3),
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
