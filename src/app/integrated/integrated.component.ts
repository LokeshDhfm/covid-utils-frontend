import { Component, OnInit } from '@angular/core';
import { HttpApiService } from '../core/services/http-api.service';

@Component({
  selector: 'app-integrated',
  templateUrl: './integrated.component.html',
  styleUrls: ['./integrated.component.css']
})
export class IntegratedComponent implements OnInit {

  protected profit: Number = 0;
  constructor(private apiService: HttpApiService) { }

  ngOnInit() {
    this.apiService.get<Number>('order/profit').subscribe((response) => this.profit = response, error => console.log(error.error.error.message));
  }

}
