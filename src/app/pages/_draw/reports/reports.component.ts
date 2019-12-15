import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';

import { DrawService } from './../../../services/draw.service';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css']
})

export class ReportsComponent implements OnInit {

    public loading = false;
    customers: Array<any>;

    items: Array<any>;
    formdata: any = {};
    search: Boolean = false;
    printing: Boolean = false;
    allowed: Boolean = false;
    agent: any = {};
    totalCustomers: Number;
    selectedCustomer: any;

    installments: Array<any>;
    disbursement: Array<any>;
    savings: Array<any>;
    loan: Array<any>;
    schemeInstallments: Array<any>;

    totalLoanDisbursed;
    totalSavingReceived;
    totalInstallmentReceived;
    totalInterestPaid;
    totalSavingFinePaid;
    totalLoanFinePaid;

    smsbalance;
    deliveries: Array<any>;

    // Router
    sub
    id

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

        this.smsCredit();
        this.smsReport();
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
                this._appService.notify('Oops! Unable to get the reports information.', 'Error!');
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
                this._appService.notify('Oops! Unable to get installment information', 'Error!');
            });
    }

    smsCredit() {
        this.loading = false;
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

    smsReport() {
        this.loading = false;
        this._drawService.smsReport().subscribe(
            data => {
                this.loading = false;
                console.log('-------------------------------------------------------');
                console.log('SMS REPORT');
                console.log(data);
                console.log(data.total);
                console.log(data.messages);
                this.deliveries = data.messages;
                console.log('-------------------------------------------------------');
            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get sms report information', 'Error!');
            });
    }

}
