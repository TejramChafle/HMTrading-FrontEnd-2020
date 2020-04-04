import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { limit } from 'src/app/app.config';
import { DrawService } from 'src/app/services/draw.service';
import { AppService } from 'src/app/app.service';
import { CustomerComponent } from 'src/app/forms/customer/customer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DrawCustomersPrintComponent } from 'src/app/components/draw-customers-print/draw-customers-print.component';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';

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
                console.log(data);
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

    deleteCustomer(customer) {
        const modalRef = this._modalService.open(ConfirmComponent, { centered: true, size: 'sm' });
        modalRef.componentInstance.type = 'Delete?';
        modalRef.componentInstance.message = 'Are you sure you want to delete customer ' + customer.name + '?';
        modalRef.result.then((data) => {
            if (data) {
                this.loading = true;
                this._drawService.deleteCustomer(customer.customer_id).subscribe(
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
        localStorage.setItem('printContent', JSON.stringify(this.customers));
        localStorage.setItem('agent', JSON.stringify(this.agent));
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
