import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoanService } from './../../../services/loan.service';
import { LoanPrintComponent } from '../../../components/loan-print/loan-print.component';
import { AppService } from 'src/app/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { limit } from 'src/app/app.config';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})

export class TransactionsComponent implements OnInit {
    public loading = false;
    payments: Array<any>;
    data: any = {};
    customer: any = {};
    account: any = {};
    totalCustomers: Number;
    accounts: Array<any>;
    search: Boolean = false;
    pagination: any = {};
    limit: number = limit;
    // Router
    sub
    id

    constructor(
        public _loanService: LoanService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _modalService: NgbModal,
        public _appService: AppService) {
        this.data.months = 1;
    }

    ngOnInit() {
        console.log('Checking limit : ' + this.limit);

        this.sub = this.activatedRoute.params.subscribe(params => {
            this.id = +params['id'];
            if (this.id) {
                console.log('show the payments of selected agent/customer : ' + this.id);
                this.getTransactions({ customer_id: this.id, limit: this.limit, offset: 0, page: 1 });
            } else {
                console.log('show the all the payments');
                this.getTransactions({ limit: this.limit, offset: 0, page: 1 });
            }
        });

    }

    getTransactions(params) {
        this.loading = true;
        this._loanService.getTransactions(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.pagination = data.pagination;
                if (this.id) {
                    this.payments = data.transactions;
                    this.customer = data.customer;
                    this.accounts = data.account;
                } else {
                    this.payments = data.records;
                }
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the transactions information.', 'Error!');
                console.log('--------------------------------------------------------');
                console.log('ERROR IN TRANSACTIONS SERVICE RESPONSE');
                console.log(error);
                console.log('--------------------------------------------------------');
            });
    }


    searchTransactions() {
        console.log('------------------------------------------------');
        console.log('SEARCH FORM DATA');

        const params: any = {};
        params.transaction_id = this.data.transaction_id && this.data.transaction_id.length ? this.data.transaction_id : undefined;
        params.created_date = this.data.created_date && this.data.created_date.length ? this.data.created_date : undefined;
        params.account_id = this.data.account_number && this.data.account_number.length ? this.data.account_number : undefined;
        params.type = this.data.type || undefined;
        if (this.id) {
            params.customer_id = this.id;
        }

        params.limit = 10;
        params.offset = 0;
        params.page = 1;

        console.log(params);
        console.log('------------------------------------------------');
        this.getTransactions(params);
    }


    print(params, isPrint: Boolean) {

        console.log('---------------------------------------------------------');
        console.log('PRINT RECEIPT');
        console.log(params);
        console.log('---------------------------------------------------------');


        if (this.id) {
            localStorage.setItem('customer', JSON.stringify(this.customer));
            localStorage.setItem('account', JSON.stringify(this.account));
            localStorage.setItem('payment', JSON.stringify(params));
        } else {
            localStorage.setItem('customer', JSON.stringify(params.customer));
            localStorage.setItem('account', JSON.stringify(params.account));
            delete params.account;
            delete params.customer;
            localStorage.setItem('payment', JSON.stringify(params));
        }
        // this.router.navigate(['loan-print']);
        const print  = new LoanPrintComponent(this._appService, this._modalService);
        print.open(isPrint);
    }

    pageChange(page) {
        console.log(page);
        const params: any = {};
        params.limit    = this.limit;
        params.offset   = this.limit * (parseInt(page, 10) - 1);
        params.page     = page;
        if (this.id) {
            params.customer_id = this.id;
        }
        if (this.search) {
            params.transaction_id = this.data.transaction_id && this.data.transaction_id.length ? this.data.transaction_id : undefined;
            params.created_date = this.data.created_date && this.data.created_date.length ? this.data.created_date : undefined;
            params.account_id = this.data.account_number && this.data.account_number.length ? this.data.account_number : undefined;
            params.type = this.data.type || undefined;
        }
        this.getTransactions(params);
    }

}
