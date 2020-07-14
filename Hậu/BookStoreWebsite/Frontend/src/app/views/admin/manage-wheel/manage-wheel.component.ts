import { Component, OnInit, ViewChild } from '@angular/core';
import { SegmentService } from 'src/app/app-services/segment-service/segment.service';
import { User } from 'src/app/app-services/user-service/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/app-services/user-service/user.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-wheel',
  templateUrl: './manage-wheel.component.html',
  styleUrls: ['./manage-wheel.component.css']
})
export class ManageWheelComponent implements OnInit {
  displayedColumns: string[] = ['_id', 'nameWheel','isActive', 'Details', 'Edit', 'Delete'];
  // dataSource: MatTableDataSource<Book>;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private _router: Router, private segmentService: SegmentService) { }
  segments: any
  ngOnInit() {
    this.getSegments();
  }
  getSegments() {
    this.segmentService.getSegments().subscribe(res => {
      this.segments = res as [];
      this.dataSource.data = this.segments;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  getSegmentByID(id: String) {
    return this._router.navigate(["/wheelDetails" + `/${id}`]);
  }
}
