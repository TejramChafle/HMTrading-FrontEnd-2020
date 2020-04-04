import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { limit } from 'src/app/app.config';
import { LoanService } from 'src/app/services/loan.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/app.service';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';

@Component({
	selector: 'app-pending-installments',
	templateUrl: './pending-installments.component.html',
	styleUrls: ['./pending-installments.component.css']
})

export class PendingInstallmentsComponent implements OnInit {
	public loading = false;
	customers: Array<any>;
	pagination: any = {};
	limit: number = limit;
	types: Array<string>;
	formdata: any = {};
	constructor(
		public _loanService: LoanService,
		public _appService: AppService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		// private _modalService: NgbModal
	) {
		this.types = ['Loan', 'Saving'];
		this.formdata.type = 'Loan';
	}

	ngOnInit() {
		this.limit = 100; // Only for this page since the pagination is not working
		this.activatedRoute.params.subscribe(params => {
			this.formdata.type = params['type'] || this.formdata.type;
			this.getPendingLoanInstallmentCustomers({ limit: this.limit, offset: 0, page: 1, type: this.formdata.type });
        });
	}

	getPendingLoanInstallmentCustomers(params) {
		this.loading = true;
		this._loanService.getPendingLoanInstallmentCustomers(params).subscribe(
			data => {
				this.loading = false;
				console.log(data);
				// this.customers = data.records;
				this.pagination = data.pagination;
				this.customers = [];
				data.records.forEach((customer)=>{
					if (customer.last_installment_paid_date) {
						customer.last_installment_paid_date = this._appService.GetWordFormattedDate(customer.last_installment_paid_date).toString();
					} else {
						customer.account_created_date = this._appService.GetWordFormattedDate(customer.account_created_date).toString();
					}
					this.customers.push(customer);
				});

				console.log('--------------------------------------------------------');
				console.log('Pending Loan Installment CUSTOMERS');
				console.log(this.customers);
				console.log('--------------------------------------------------------');
				
			},
			error => {
				this.loading = false;
				// this._appService.notify('Oops! Unable to get the customers information.', 'Error!');
				console.log('--------------------------------------------------------');
				console.log('ERROR IN CUSTOMERS');
				console.log(error);
				console.log('--------------------------------------------------------');
			}
		);
	}


	pageChange(page) {
        console.log(page);
        const params: any = {};
        params.limit = this.limit;
        params.offset = this.limit * (parseInt(page, 10) - 1);
        params.page = page;
        this.getPendingLoanInstallmentCustomers({ limit: this.limit, offset: params.offset, page: params.page, type: this.formdata.type });
	}
	
	viewInstallments(customer) {
        this.router.navigate(['installment-history', JSON.stringify(customer)]);
	}
	
	transactions(id) {
        this.router.navigate(['transactions', id]);
	}
	
	sendNotification(customer?:any) {
		console.log(customer);
	}
}

