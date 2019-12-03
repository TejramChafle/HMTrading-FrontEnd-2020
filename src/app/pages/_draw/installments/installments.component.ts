import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { limit } from 'src/app/app.config';
import { DrawService } from '../../../services/draw.service';
import { AppService } from 'src/app/app.service';
import { PrintComponent } from 'src/app/components/print/print.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-installments',
    templateUrl: './installments.component.html',
    styleUrls: ['./installments.component.css']
})

export class InstallmentsComponent implements OnInit {

    installments: Array<any>;
    public loading = false;
    data: any = {};
    showingForAgent: Boolean = false;
    printing: Boolean = false;
    selectCustomer: Boolean = false;
    count: Number;

    items: Array<any>;
    paidInstallments: Array<any>;
    schemeInstallments: Array<any>;
    search: Boolean = false;
    isAmountIncorrent: Boolean = false;

    pagination: any = {};
    limit: number = limit;

    // select all records flag
    selectAll: Boolean = false;

    // Router
    sub
    id

    constructor(
        public _drawService: DrawService,
        public _appService: AppService,
        private _modalService: NgbModal,
        private router: Router,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.id = +params['id'];
        });
        // Hardcoded since there is only one scheme and it's id is 1
        if (this.schemeInstallments) {
            if (this.id) {
                console.log('Get all the customers for the agent id : ' + this.id);
                this.getInstallments({ agent_id: this.id, limit: this.limit, offset: 0, page: 1 });

                // Set the flag if the records are being shown for agent id
                this.showingForAgent = true;
            } else {
                this._appService.agent = null;
                this.getInstallments({ limit: this.limit, offset: 0, page: 1 });
            }
        } else {
            this.getSchemeInstallments(1);
        }
    }

    getInstallments(params) {
        this.loading = true;
        this._drawService.getInstallments(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.installments = data.records;
                this.pagination = data.pagination;

                if (this.showingForAgent) {
                    this.count = this.installments.length;
                }

                this.installments.forEach((cust) => {
                    cust.total = 0;
                    cust.totalInstPrice = 1820;
                    cust.installment.forEach(element => {
                        if (element.amount) {
                            cust.total += parseInt(element.amount, 10);
                        }
                    });

                    cust.nextInstAmt = this.schemeInstallments[cust.installment.length].installment_price ? this.schemeInstallments[cust.installment.length].installment_price : null;
                    cust.installment_price = this.schemeInstallments[cust.installment.length].installment_price;
                    cust.scheme_installment_id = this.schemeInstallments[cust.installment.length].scheme_installment_id;
                    cust.installment_date = this.schemeInstallments[cust.installment.length].installment_date;
                    cust.installment_month = this.schemeInstallments[cust.installment.length].month;
                    cust.installment_fine = this.schemeInstallments[cust.installment.length].fine;
                    cust.balance = parseInt(cust.totalInstPrice, 10) - parseInt(cust.total, 10);
                });

                console.log('-------------------------------------------------------');
                console.log('MODIFIED INSTALLMENTS');
                console.log(this.installments);
                console.log('-------------------------------------------------------');

                // Fetch the list of items if missing/not loaded
                if (!this.items || !this.items.length) {
                    this.getItems();
                }

            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get installment information.', 'Error!');
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
                this._appService.notify('Oops! Unable to get the items information.', 'Error!');
                console.log(error);
            });
    }


    editInstallment(id) {
        this.router.navigate(['add-installment', id]);
    }

    print(params, data, total_paid) {
        this.count = params.length;
        localStorage.setItem('count', this.count.toString());

        if (this.id && this._appService.agent) {
            localStorage.setItem('agent', JSON.stringify(this._appService.agent));
        }
        localStorage.setItem('totalPaid', total_paid.toString());
        localStorage.setItem('receipt', data);
        localStorage.setItem('printContent', JSON.stringify(params));
        localStorage.setItem('isAgent', '1');

        console.log('PRINT PAGE INFO -----------------------------------------------------------------')
        console.log('count : ', this.count.toString());
        console.log('agent : ', this._appService.agent);
        console.log('total : ', total_paid.toString());
        console.log('receipt : ', data);
        console.log('content : ', params);
        console.log('---------------------------------------------------------------------------------')

        // this.router.navigate(['print']);
        const print = new PrintComponent(this._appService, this._modalService);
        print.open(true);
    }

    addInstallments() {
        this.selectCustomer = true;
    }

    submitInstallments() {
        let params = [];
        let insta_params = [];
        let input = [];
        let total = 0;

        // Find if any of the record is unchecked
        let checked = this.installments.find((element) => {
            return element.checked;
        });

        // If any record is unchecked, return
        if (!checked) {
            this._appService.notify('Please select/check record to submit installment.');
            return false;
        }

        try {
            this.installments.forEach((element) => {
                if (element.checked) {

                    if (element.nextInstAmt > element.installment_price) {
                        let nextInstAmt = element.nextInstAmt;
                        let temp = [];
                        this.schemeInstallments.forEach((inst) => {
                            if (inst['scheme_installment_id'] >= element['scheme_installment_id']) {

                                if (nextInstAmt > 0 && nextInstAmt >= inst['installment_price']) {
                                    const par = {
                                        scheme_installment_id: inst['scheme_installment_id'],
                                        amount: inst['installment_price'],
                                        installment_date: inst['installment_date'],
                                        month: inst['month']
                                    }

                                    if (new Date(inst['installment_date']) < new Date()) {
                                        par['fine'] = inst['fine']
                                    }

                                    total += parseInt(element.amount, 10);
                                    temp.push(par);
                                } else if (nextInstAmt > 0 && nextInstAmt < inst['installment_price']) {
                                    // this._appService.notify('The entered amount '+ element.nextInstAmt +' does not fit in the month installments! Please remove fine if addded. Refer month installments table for more information.');
                                    this.isAmountIncorrent = true;
                                    throw element;
                                }
                                nextInstAmt -= inst['installment_price'];
                            }
                        });

                        params.push({
                            customer_id: element.customer_id,
                            phone: element.mobile_number,
                            name: element.name,
                            card_number: element.card_number,
                            item: element.item,
                            installments: temp,
                            agent: element.agent
                        });

                    } else {
                        // console.log('---------------------------------------------------------');
                        // console.log('Checking entered amount');
                        // console.log(element);
                        // console.log('Checking installment price');
                        // console.log(inst['installment_price']);
                        // console.log('---------------------------------------------------------');

                        if (element.nextInstAmt < parseInt(element['installment_price'], 10)) {
                            this._appService.notify('The entered installment amount for customer ' + element.name + ' is incorrect! The expected amount for ' + element.installment_month + ' is ' + element.installment_price);
                            this.isAmountIncorrent = true;
                            return false;
                        }

                        const par = {
                            scheme_installment_id: element['scheme_installment_id']
                        }

                        if (element.nextInstAmt > 0) {
                            par['amount'] = element['installment_price'];
                            par['installment_date'] = element['installment_date'];
                            par['month'] = element['installment_month']
                        }

                        if (new Date(element['installment_date']) < new Date()) {
                            par['fine'] = element.installment_fine;
                        }

                        total += parseInt(element.amount, 10);
                        params.push({
                            customer_id: element.customer_id,
                            name: element.name,
                            phone: element.mobile_number,
                            card_number: element.card_number,
                            item: element.item,
                            installments: [par],
                            agent: element.agent
                        })
                    }
                }
            });
        } catch (element) {
            this._appService.notify('The entered amount ' + element.nextInstAmt + ' for customer ' + element.name + ' does not fit in the month installments! Please remove fine if addded. Refer month installments table for more information.');
        }

        // Stop execution if the amount is incorrect
        if (this.isAmountIncorrent) {
            return false;
        }

        console.log('---------------------------------------------------------');
        console.log('Customers selected');
        console.log(params);
        console.log('---------------------------------------------------------');

        // this.print(params, 34, total);

        this.loading = true;
        this._drawService.addInstallment(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.selectCustomer = false;
                this.ngOnInit();
                // Print the recently added installments
                // this.printPaidInstallments(insta_params, data);
                this.print(params, data, total);
            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get installment information.', 'Error!');
            });
    }


    searchCustomer() {
        console.log('------------------------------------------------');
        console.log('SEARCH FORM DATA');

        const params: any = {};

        params.name = this.data.name && this.data.name.length ? this.data.name : undefined;
        params.card_number = this.data.card_number && this.data.card_number.length ? this.data.card_number : undefined;
        params.mobile_number = this.data.mobile_number && this.data.mobile_number.length ? this.data.mobile_number : undefined;
        params.item_id = this.data.item_id;

        params.limit = 10;
        params.offset = 0;
        params.page = 1;

        if (this.id) {
            params.agent_id = this.id;
        }

        console.log(params);
        console.log('------------------------------------------------');
        this.getInstallments(params);
    }



    printPaidInstallments(params, receipt) {

        console.log('-------------------------------------------------');
        console.log('Inside print paid intallments');
        console.log(params);
        console.log('-------------------------------------------------');

        this._drawService.getInstallmentsOfSelectedCustomers(params).subscribe(
            data => {
                this.loading = false;
                // Refresh the installments
                this.ngOnInit();

                console.log(data);
                this.installments = data;

                if (this.showingForAgent) {
                    this.count = this.installments.length;
                }
                let total_paid = 0;
                data.forEach((cust) => {
                    cust.total = 0;
                    cust.totalInstPrice = 1820;
                    var size = cust.installment.length;
                    cust.last_paid_month = cust.installment[size - 1]['month'];
                    cust.last_paid_amount = cust.installment[size - 1]['amount'];
                    cust.last_paid_fine = cust.installment[size - 1]['paid_fine'];
                    cust.last_paid_total = parseInt(cust.last_paid_amount, 10) + (cust.last_paid_fine ? parseInt(cust.last_paid_fine, 10) : 0);
                    total_paid += parseInt(cust.last_paid_total, 10);

                    cust.installment.forEach(element => {
                        if (element.amount) {
                            cust.total += parseInt(element.amount, 10);
                        }
                    });
                    cust.balance = parseInt(cust.totalInstPrice, 10) - parseInt(cust.total, 10);
                });

                console.log('-------------------------------------------------------');
                console.log('MODIFIED INSTALLMENTS FOR PRINT');
                console.log(data);
                console.log('-------------------------------------------------------');

                this.count = data.length;
                if (this.id && this._appService.agent) {
                    localStorage.setItem('agent', JSON.stringify(this._appService.agent));
                }
                localStorage.setItem('count', this.count.toString());
                localStorage.setItem('totalPaid', total_paid.toString());
                localStorage.setItem('receipt', receipt);
                localStorage.setItem('printContent', JSON.stringify(this.installments));

                // this.router.navigate(['print']);
                const print = new PrintComponent(this._appService, this._modalService);
                print.open(true);

            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get installment information.', 'Error!');
            });
    }


    cancelAddInstallments() {
        this.installments.forEach((element) => {
            if (element.checked) {
                delete element.checked;
            }
        });
        this.selectCustomer = false;
    }

    getSchemeInstallments(params) {
        this.loading = true;
        this._drawService.getSchemeInstallments(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.schemeInstallments = data;
                console.log('-------------------------------------------------------');
                console.log('SCHEME INSTALLMENTS');
                console.log(data);
                console.log('-------------------------------------------------------');

                // GET INSTALLMENTS
                if (this.id) {
                    this.getInstallments({ agent_id: this.id, limit: this.limit, offset: 0, page: 1 });
                    this.showingForAgent = true;
                } else {
                    this.getInstallments({ limit: this.limit, offset: 0, page: 1 });
                }
            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get installment information.', 'Error!');
            });
    }


    addCustomer() {
        this.id ? localStorage.setItem('agentId', this.id) : localStorage.setItem('agentId', null);
        this.router.navigate(['add-customer']);
    }


    pageChange(page) {
        console.log(page);
        const params: any = {};
        params.limit = this.limit;
        params.offset = this.limit * (parseInt(page, 10) - 1);
        params.page = page;
        if (this.id) {
            params.agent_id = this.id;
        }
        if (this.search) {
            params.name = this.data.name && this.data.name.length ? this.data.name : undefined;
            params.card_number = this.data.card_number && this.data.card_number.length ? this.data.card_number : undefined;
            params.mobile_number = this.data.mobile_number && this.data.mobile_number.length ? this.data.mobile_number : undefined;
            params.item_id = this.data.item_id;
        }
        this.getInstallments(params);
    }

    // Select all the customers
    onChangeSelection() {
        if (this.selectAll) {
            this.installments.forEach((element) => {
                element.checked = true;
            });
        } else {
            this.installments.forEach((element) => {
                element.checked = false;
            });
        }
        this.selectCustomer = true;
    }

}
