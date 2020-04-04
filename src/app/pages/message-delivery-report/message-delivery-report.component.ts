import { Component, OnInit } from '@angular/core';

import { DrawService } from 'src/app/services/draw.service';
import { AppService } from 'src/app/app.service';
import { limit } from 'src/app/app.config';

@Component({
  selector: 'app-message-delivery-report',
  templateUrl: './message-delivery-report.component.html',
  styleUrls: ['./message-delivery-report.component.css']
})
export class MessageDeliveryReportComponent implements OnInit {
  public loading = false;
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
    this.smsCredit();
    this.smsReport({ start: 0, limit: this.limit });
    this.pagination.page = 1;
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

  pageChange(page) {
    console.log(page);
    const params: any = {};
    params.limit = this.limit;
    params.start = this.limit * (parseInt(page, 10) - 1);
    this.pagination.page = page;
    console.log(params);
    this.smsReport(params);
  }

}
