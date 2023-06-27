import { Component, AfterViewInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.css']
})
export class MyTableComponent implements AfterViewInit {
  ngAfterViewInit() {
    // No need to use $(document).read() in ngAfterViewInit
    ($('#dataTable') as any).DataTable({
        "processing": true,
        "serverSide": true,
        "lengthMenu": [[50, 100, 500], [50, 100, 500]], // Move this here
        "ajax": (data: any, callback: any, settings: any) => {
          let pageIndex = data.start / data.length; // calculate the current page index
          let pageSize = data.length; // calculate the page size
          let sortColumn = data.columns[data.order[0].column].data; // get the name of the column to sort
          let sortDirection = data.order[0].dir; // get the direction of the sort
          let searchTerm = data.search.value; // get the search term

          $.ajax({
              url: searchTerm
                  ? `http://localhost:5000/api/data/search/${pageIndex}/${pageSize}` // use search
                  : `http://localhost:5000/api/data/${pageIndex}/${pageSize}`, // use pagination'
              type: 'GET',
              data: {
                sortColumn: sortColumn,
                sortDirection: sortDirection,
                searchTerm: searchTerm
              },
              success: (result: any) => {
                callback({
                  recordsTotal: result.totalCount,
                  recordsFiltered: result.totalCount,
                  data: result.data
                });
              }
            });
          },
          "columns": [
            { "data": "id" },
            { "data": "name" },
            { "data" : "occupation" },
            { "data" : "age" },
            { "data" : "email" }
          ]
        });   
    }
}