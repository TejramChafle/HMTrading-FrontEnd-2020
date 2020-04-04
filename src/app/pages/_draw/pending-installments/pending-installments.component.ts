import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';

import { DrawService } from 'src/app/services/draw.service';
import { AppService } from 'src/app/app.service';
import { limit } from 'src/app/app.config';

@Component({
    selector: 'app-reports',
    templateUrl: './pending-installments.component.html',
    styleUrls: ['./pending-installments.component.css']
})

export class DrawPendingInstallmentsComponent implements OnInit {

    public loading = false;
    customers: Array<any>;

    formdata: any = {};
    search: Boolean = false;
    agent: any = {};
    schemeInstallments: Array<any>;

    smsbalance;
    deliveries: Array<any>;

    pagination: any = {};
    limit: number = limit;

    constructor(
        public _drawService: DrawService,
        public _appService: AppService,
        // private router: Router
    ) {
    }

    ngOnInit() {
        if (localStorage.getItem('schemeInstallments')) {
            this.schemeInstallments = JSON.parse(localStorage.getItem('schemeInstallments'));
        } else {
            this.getSchemeInstallments();
        }
        const today = new Date();
        const month = today.getMonth();
        this.formdata.scheme_installment_id = month == 11 ? 1 : month + 2;
        const params = { scheme_installment_id: this.formdata.scheme_installment_id };
        this.getPendingInstallments(params);

        // this.smsCredit();
        // this.smsReport({start: 0, limit: this.limit});
        this.pagination.page = 1;
    }

    getPendingInstallments(params) {
        this.loading = true;
        this._drawService.getPendingInstallments(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.customers = data;

                console.log('--------------------------------------------------------');
                console.log('STATISTICS');
                console.log(this.customers);
                console.log('--------------------------------------------------------');
            },
            error => {
                this.loading = false;
                // this._appService.notify('Oops! Unable to get the reports information.', 'Error!');
                console.log('--------------------------------------------------------');
                console.log('ERROR IN STATISTICS');
                console.log(error);
                console.log('--------------------------------------------------------');
            });
    }

    getSchemeInstallments() {
        this.loading = false;
        this._drawService.getSchemeInstallments(1).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.schemeInstallments = data;
                console.log('-------------------------------------------------------');
                console.log('SCHEME INSTALLMENTS');
                console.log(this.schemeInstallments);
                console.log('-------------------------------------------------------');
            },
            error => {
                this.loading = false;
                console.log(error);
                // this._appService.notify('Oops! Unable to get installment information', 'Error!');
            });
    }

    smsCredit() {
        // this.loading = false;
        this._drawService.smsCredit().subscribe(
            data => {
                this.loading = false;
                console.log('-------------------------------------------------------');
                console.log('SMS CREDIT');
                console.log(data);
                console.log(data.balance.sms);
                this.smsbalance = data.balance.sms;
                console.log('-------------------------------------------------------');
            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get installment information', 'Error!');
            });
    }

    smsReport(params: any = {}) {
        this.loading = true;
        this._drawService.smsReport(params).subscribe(
            data => {
                this.loading = false;
                console.log('-------------------------------------------------------');
                console.log('SMS REPORT');
                console.log(data);
                console.log(data.total);
                console.log(data.messages);
                this.deliveries = data.messages;
                this.pagination.size = data.total;
                this.pagination.limit = data.limit;
                console.log('this.pagination', this.pagination);
                console.log('-------------------------------------------------------');
            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get sms report information', 'Error!');
            });
    }



    // SEND NOTIFICATION to the customers for pending installment
    sendNotification() {
        this.loading = true;
        this._drawService.sendNotification({ scheme_installment_id: this.formdata.scheme_installment_id }).subscribe(
            data => {
                this.loading = false;
                console.log('-------------------------------------------------------');
                console.log('SEND NOTIFICATION');
                console.log(data);
                console.log('-------------------------------------------------------');
            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get sms report information', 'Error!');
            });
    }

}
