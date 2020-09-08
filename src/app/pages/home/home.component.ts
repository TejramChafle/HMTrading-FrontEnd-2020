import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DrawService } from 'src/app/services/draw.service';
import { AppService } from 'src/app/app.service';
import { LoanService } from 'src/app/services/loan.service';
import { StatisticsComponent } from '../_loan/statistics/statistics.component';
import { PendingInstallmentsComponent } from '../_loan/pending-installments/pending-installments.component';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    public loading = false;
    distribution: any={};
    dashboard: any = {};
    statistics: any;
    pendingLoanInstallments: number;
    pendingSavingInstallments: number;

    constructor(
        private _router: Router,
        public _drawService: DrawService,
        public _loanService: LoanService,
        public _appService: AppService,
        public _activatedRoute: ActivatedRoute) {
            // Initialize the statistics component
            this.statistics = new StatisticsComponent(this._loanService, this._appService);

            // Check if the local storage is saved. This will help to display the stored records.
            if (localStorage.getItem('distribution')) {
                // this.distribution = JSON.parse(localStorage.getItem('distribution'));
                this.initItemDistribution(JSON.parse(localStorage.getItem('distribution')));
            }
            if (localStorage.getItem('dashboard')) {
                this.dashboard = JSON.parse(localStorage.getItem('dashboard'));
            }
            if (localStorage.getItem('pendingSavingInstallments')) {
                this.pendingSavingInstallments = JSON.parse(localStorage.getItem('pendingSavingInstallments'));
            }
            if (localStorage.getItem('pendingLoanInstallments')) {
                this.pendingLoanInstallments = JSON.parse(localStorage.getItem('pendingLoanInstallments'));
            }
            if (localStorage.getItem('statistics')) {
                let statistics = JSON.parse(localStorage.getItem('statistics'));
                this.statistics.calculateStatistics(statistics);
            }
    }

    ngOnInit() {
        
        this.initDashboard();

        if (this._appService.isDrawDashboard) {
            this.itemDistribution({ limit: 100, offset: 0, page: 1 });
        } else {
            // Get the loan statistics details from StatisticsComponent
            this.statistics.getStatistics({ year: 2018 });

            // Total pending savings installments
            this._loanService.getPendingLoanInstallmentCustomers({ limit: 100, offset: 0, page: 1, type: 'Saving' }).subscribe((result)=>{
                this.pendingSavingInstallments = result.records.length;
                localStorage.setItem('pendingSavingInstallments', this.pendingSavingInstallments.toString());
            });
            
            // Total pending loan installments
            this._loanService.getPendingLoanInstallmentCustomers({ limit: 100, offset: 0, page: 1, type: 'Loan' }).subscribe((result)=>{
                this.pendingLoanInstallments = result.records.length;
                localStorage.setItem('pendingLoanInstallments', this.pendingLoanInstallments.toString());
            });
        }
    }

    navigate(path) {
        this._router.navigate([path]);
    }

    itemDistribution(params) {
        this.loading = true;
        this._drawService.itemDistribution(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                // this.distribution = data.records;
                localStorage.setItem('distribution', JSON.stringify(data));
                this.initItemDistribution(data);
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the item distribution information.', 'Error!');
                console.log(error);
            }
        );
    }

    initDashboard() {
        this.loading = true;
        this._drawService.initDashboard().subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.dashboard = data;
                localStorage.setItem('dashboard', JSON.stringify(this.dashboard));
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the item distribution information.', 'Error!');
                console.log(error);
            }
        );
    }

    initItemDistribution(data) {
        console.log('initItemDistribution data', data);
        this.distribution = {
            regular_customer_distribution: 0,
            lucky_customer_distribution: 0
        };
        data.records.forEach(record => {
            this.distribution.regular_customer_distribution += parseInt(record.total);
        });
        data.lucky_customer_distribution.forEach(record => {
            this.distribution.lucky_customer_distribution += parseInt(record.draw_item_total);
        });
    }
}
