import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
  transform( array: Array<any>, filterField: string, filterValue: string ): Array<any> {
    if (!array) return [];
    return array.filter(item => item[filterField] == filterValue);
}

}
