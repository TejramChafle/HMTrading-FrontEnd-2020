import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { limit } from 'src/app/app.config';
import { DrawService } from '../../../services/draw.service';
import { AppService } from 'src/app/app.service';
import { CustomerComponent } from './../../../forms/customer/customer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DrawCustomersPrintComponent } from '../../../components/draw-customers-print/draw-customers-print.component';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {
    public loading = false;
    customers: Array<any>;
    data: any = {};
    search: Boolean = false;
    printing: Boolean = false;
    agent: any = {};
    totalCustomers: Number;

    pagination: any = {};
    limit: number = limit;

    // Router
    sub
    id

    constructor(
        private _drawService: DrawService,
        private _modalService: NgbModal,
        public _appService: AppService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        console.log('AGENTS:', this._appService.agents);
        // Get the agents from server
        if (!this._appService.agents) {
            this._drawService.agents();
        }
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            console.log(params);
            this.agent = params['id'] ? JSON.parse(params['id']) : null;
            console.log(this.agent);
            if (this.agent) {
                console.log('Get all the customers of agent id : ' + this.agent.customer_id);
                // this.getCustomers({agent_id : this.id});
                // this.printing = true;
                this.getInstallments({ agent_id: this.agent.customer_id, limit: this.limit, offset: 0, page: 1 });
                // this.getItems();
            } else {
                console.log('Get all the customers');
                this.getInstallments({ limit: this.limit, offset: 0, page: 1 });
                // this.getCustomers({});
                // this.getItems();
            }
        });
    }

    getCustomers(params) {
        this.loading = true;
        this._drawService.getCustomers(params).subscribe(
            data => {
                // this.loading = false;
                console.log(data);
                this.customers = data.records;
                this.pagination = data.pagination;
                this.getItems();
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the customers information.', 'Error!');
                console.log('--------------------------------------------------------');
                console.log('CUSTOMERS');
                console.log(error);
                console.log('--------------------------------------------------------');
            });
    }

    getInstallments(params) {
        this.loading = true;
        this._drawService.getInstallments(params).subscribe(
            data => {
                // console.log(data);

                data.records.forEach((cust) => {
                    if (cust.item) {
                        cust.total = 0;
                        cust.totalInstPrice = 1820;
                        cust.installment.forEach(element => {
                            if (element.amount) {
                                cust.total += parseInt(element.amount, 10);
                            }
                        });
                        cust.balance = parseInt(cust.totalInstPrice, 10) - parseInt(cust.total, 10);
                    }
                });


                this.customers = data.records;
                console.log('-------------------------------------------------------');
                console.log('MODIFIED CUSTOMERS');
                console.log(this.customers);
                console.log('-------------------------------------------------------');
                this.getItems();
                this.loading = false;

                // this.agent = this.customers[0].agent;
                this.totalCustomers = this.customers.length;
                this.pagination = data.pagination;
            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get installment information.', 'Error!');
            });
    }


    getItems() {

        // Don't load the items already loaded
        if (this._appService.items) {
            return false;
        }

        // this.loading = true;
        this._drawService.getItems({ limit: 100, offset: 0, page: 1 }).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this._appService.items = data.records;
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get items information.', 'Error!');
                console.log(error);
            });
    }

    editCustomer(id) {
        this.router.navigate(['add-customer', id]);
    }

    editInstallment(id) {
        this.router.navigate(['add-installment', id]);
    }

    deleteCustomer(id) {
        var conf = confirm('Are you sure you want to delete this customer?');
        if (!conf) {
            return false;
        }

        this.loading = true;
        this._drawService.deleteCustomer(id).subscribe(
            data => {
                this._appService.notify('Customer deleted successfully.', 'Success!');
                this.loading = false;
                // Refresh the customer list
                this.ngOnInit();
            }, error => {
                this.loading = false;
                this._appService.notify('Sorry, we cannot process your request.', 'Error!');
            });
    }

    searchCustomer() {
        console.log('------------------------------------------------');
        console.log('SEARCH FORM DATA');

        const params: any = {};
        params.name = this.data.name && this.data.name.length ? this.data.name : undefined;
        params.email = this.data.email && this.data.email.length ? this.data.email : undefined;
        params.address = this.data.address && this.data.address.length ? this.data.address : undefined;
        params.card_number = this.data.card_number && this.data.card_number.length ? this.data.card_number : undefined;
        params.mobile_number = this.data.mobile_number && this.data.mobile_number.length ? this.data.mobile_number : undefined;
        params.item_id = this.data.item_id || undefined;

        params.limit = 10;
        params.offset = 0;
        params.page = 1;
        console.log(params);
        console.log('------------------------------------------------');
        // this.getCustomers(params);
        this.getInstallments(params);
    }


    print() {
        /* this.printing = true;

        let popupWin = window.open('_blank');
        let printContents = document.getElementById('customer_table').innerHTML;

        popupWin.document.open();
        popupWin.document.write(`
            <html>
            <head>
                <title></title>
                <!-- Bootstrap 3.0 -->
                <!-- Latest compiled and minified CSS -->
                <link rel="stylesheet" type="text/css" media='all' href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous" media="all">
                <style>
                    @media all {
                        table, td, th {
                            border: 1px gray;
                            border-collapse: collapse;
                        }

                        .bg-dark{ background-color: gray!important; color: #ebdef0 !important}
                    }
                </style>
            </head>
        <body onload="window.print();window.close()">
        <br><br>
        <div align="center">
            <b><u>H.M. TRADING</u></b><br>
            House No. 1, Behind Petrol Pump, Kandri- 441401<br>
            Pro: Pramod Ingole<br>
            Office: 8806091880, 9960566547 <br>
            Email: contact@hmtrading.biz<br>
            www.hmtrading.biz
        </div>
        <br>
        <hr>
            <strong>Agent : </strong>${this.agent.name} <span style="float:right"><strong>Count:</strong> ${this.totalCustomers}</span>
        <hr>
        ${printContents}
        </body>
            </html>`
        );

        popupWin.document.close(); */

        localStorage.setItem('printContent', JSON.stringify(this.customers));
        localStorage.setItem('printContent', JSON.stringify(this.agent));
        if (this.agent) { localStorage.setItem('isAgent', '1') };
        const page = new DrawCustomersPrintComponent(this._appService, this._modalService);
        page.open(true);
    }


    pageChange(page) {
        console.log(page);
        const params: any = {};
        params.limit = this.limit;
        params.offset = this.limit * (parseInt(page, 10) - 1);
        params.page = page;

        if (this.search) {
            params.name = this.data.name && this.data.name.length ? this.data.name : undefined;
            params.email = this.data.email && this.data.email.length ? this.data.email : undefined;
            params.address = this.data.address && this.data.address.length ? this.data.address : undefined;
            params.card_number = this.data.card_number && this.data.card_number.length ? this.data.card_number : undefined;
            params.mobile_number = this.data.mobile_number && this.data.mobile_number.length ? this.data.mobile_number : undefined;
            params.item_id = this.data.item_id || undefined;
        }
        // this.getCustomers(params);
        this.getInstallments(params);
    }

    addCustomer(customer?: any) {
        console.log('this._appService.agents : ', this._appService.agents);
        const modalRef = this._modalService.open(CustomerComponent, { size: 'lg' });
        modalRef.componentInstance.formdata = customer || {};
        modalRef.componentInstance.agents = this._appService.agents || [];
        modalRef.componentInstance.items = this._appService.items || [];
        modalRef.result.then((data) => {
            console.log('_modalService data : ', data);
            if (data) {
                this.ngOnInit();
            }
        }).catch((error) => {
            console.log(error);
            // this._appService.notify('Failed to perform operation.', 'Error!');
        });
    }
}
