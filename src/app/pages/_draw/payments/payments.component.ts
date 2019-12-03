import { AppService } from './../../../app.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DrawService } from '../../../services/draw.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrintComponent } from '../../../components/print/print.component';
import { limit } from 'src/app/app.config';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css']
})

export class PaymentsComponent implements OnInit {

    public loading = false;
    payments: Array<any>;
    data: any = {};
    agent: any = {};
    totalCustomers: Number;
    items: Array<any>;
    search: Boolean = false;

    pagination: any = {};
    limit: number = limit;

    // Router
    sub
    id

    constructor(
        public _drawService: DrawService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _modalService: NgbModal,
        public _appService: AppService) {
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.id = +params['id'];
            if (this.id) {
                this.getPayments({ customer_id: this.id, limit: this.limit, offset: 0, page: 1 });
            } else {
                this._appService.agent = null;
                this.getPayments({ limit: this.limit, offset: 0, page: 1 });
            }
        });
    }

    getPayments(params) {
        this.loading = true;
        this._drawService.getPayments(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.payments = data.records;
                this.pagination = data.pagination;
                this.getItems();
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get payments information');
                console.log('--------------------------------------------------------');
                console.log('ERROR IN PAYMENTS SERVICE RESPONSE');
                console.log(error);
                console.log('--------------------------------------------------------');
            });
    }

    getItems() {
        // Don't load the items already loaded
        if (this.items) {
            return false;
        }
        // this.loading = true;
        this._drawService.getItems({ limit: 100, offset: 0, page: 1 }).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.items = data.records;
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get items information');
                console.log(error);
            });
    }


    print(params, receipt, isPrint: Boolean) {

        console.log('---------------------------------------------------------');
        console.log('PRINT RECEIPT');
        console.log(receipt);
        console.log('---------------------------------------------------------');

        let count: any;
        count = params.length;
        localStorage.setItem('count', count.toString());

        if (receipt.is_agent === '0') {
            localStorage.setItem('agent', JSON.stringify(receipt.agent));
            localStorage.setItem('customer', JSON.stringify(receipt.customer));
        } else {
            localStorage.setItem('agent', JSON.stringify(receipt.customer));
            localStorage.setItem('customer', JSON.stringify(receipt.customer));
        }


        localStorage.setItem('totalPaid', receipt.amount.toString());
        localStorage.setItem('receipt', receipt.receipt_id);
        localStorage.setItem('isAgent', receipt.is_agent);
        localStorage.setItem('billingDate', receipt.receipt_date);

        localStorage.setItem('printContent', JSON.stringify(params));
        // this.router.navigate(['print']);
        let print  = new PrintComponent(this._appService, this._modalService);
        print.open(isPrint);
    }


    printReady(receipt, isPrint: Boolean): void {
        console.log('---------------------------------------------------------');
        console.log('PRINT RECEIPT');
        console.log(receipt);
        console.log('---------------------------------------------------------');

        let params = [];
        let customers = [];
        let installments = [];
        let input = [];
        let total = 0;

        console.log('---------------------------------------------------------');
        console.log('PRINT installments');
        console.log(installments);
        console.log('---------------------------------------------------------');

        // Get the items if not available
        if (!this.items) {
            this.getItems();
        }

        receipt.payments.forEach(element => {
            let records = receipt.payments.filter(function (record) {
                return element.customer_id == record.customer_id;
            });

            element.item = this.items.find(function (item) {
                return item.item_id == element.item_id;
            });

            if (!customers.includes(element.customer_id)) {
                console.log('---------------------------------------------------------');
                console.log('PRINT records');
                console.log(records);
                console.log('---------------------------------------------------------');

                records.forEach(record => {
                    const par = {
                        scheme_installment_id: record['scheme_installment_id'],
                        amount: record['amount'],
                        month: record['month'],
                        fine: record['paid_fine'],
                    };
                    installments.push(par);
                    total = total + parseInt(record.amount, 10) + parseInt(record['paid_fine'], 10);
                });

                params.push({
                    customer_id: element.customer_id,
                    name: element.name,
                    card_number: element.card_number,
                    item: element.item,
                    installments: installments
                });

                console.log('---------------------------------------------------------');
                console.log('PRINT installments of ' + element.customer_id);
                console.log(installments);
                console.log('---------------------------------------------------------');

                customers.push(element.customer_id);
                installments = [];

                console.log('---------------------------------------------------------');
                console.log('PRINT customers');
                console.log(customers);
                console.log('---------------------------------------------------------');
            }

        });

        this.print(params, receipt, isPrint);
    }


    searchTransactions() {
        console.log('------------------------------------------------');
        console.log('SEARCH FORM DATA');

        const params: any = {};

        // params.card_number = this.data.card_number && this.data.card_number.length ? this.data.card_number : undefined;
        params.receipt_id = this.data.receipt_id && this.data.receipt_id.length ? this.data.receipt_id : undefined;
        params.receipt_date = this.data.created_date && this.data.created_date.length ? this.data.created_date : undefined;

        if (this.id) {
            params.customer_id = this.id;
        }

        params.limit = 10;
        params.offset = 0;
        params.page = 1;

        console.log(params);
        console.log('------------------------------------------------');
        this.getPayments(params);
    }


    pageChange(page) {
        console.log(page);
        const params: any = {};
        params.limit = this.limit;
        params.offset = this.limit * (parseInt(page, 10) - 1);
        params.page = page;
        if (this.id) {
            params.customer_id = this.id;
        }
        if (this.search) {
            // params.card_number = this.data.card_number && this.data.card_number.length ? this.data.card_number : undefined;
            params.receipt_id = this.data.receipt_id && this.data.receipt_id.length ? this.data.receipt_id : undefined;
            params.receipt_date = this.data.created_date && this.data.created_date.length ? this.data.created_date : undefined;
        }
        this.getPayments(params);
    }

}
