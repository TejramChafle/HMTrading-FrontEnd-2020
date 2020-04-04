import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'print-footer',
    templateUrl: './print-footer.component.html'
})

export class PrintFooterComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        console.log('PRINT FOOTER');
    }
}
