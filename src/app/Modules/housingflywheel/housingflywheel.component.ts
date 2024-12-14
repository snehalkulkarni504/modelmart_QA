import { Component } from '@angular/core';

@Component({
  selector: 'app-housingflywheel',
  templateUrl: './housingflywheel.component.html',
  styleUrls: ['./housingflywheel.component.css']
})
export class HousingflywheelComponent {
  tableData = [
    { property: 'Speaker Grill', value: '0' },
    { property: 'No. Of Cavity', value: '1' },
    { property: 'Cavity / Core Material', value: 'H13' },
    { property: 'Mold Base Material', value: 'C45' },
    { property: 'Construction Type', value: 'Monoblock' },
    { property: 'Gate Type', value: '0' }
  ];
  tableData2 = [
    { description: 'Top Plate Size', materialGrade: 'C45/S55', unit: 'mm', heightZaxis: '70' },
    { description: 'Cavity back plate / HRS Plate (If required)', materialGrade: 'C45/S55', unit: 'mm', heightZaxis: '0' },
    { description: 'Cavity plate (insert or Monoblock)', materialGrade: 'P20/H11/H13', unit: 'mm', heightZaxis: '275' },
    { description: 'Core plate (insert or Monoblock)', materialGrade: 'P20/H11/H13', unit: 'mm', heightZaxis: '275' },
    { description: 'Core back plate (If required)', materialGrade: 'C45/S55', unit: 'mm', heightZaxis: '0' },
    { description: 'Ejector Box Height', materialGrade: 'C45/S55', unit: 'mm', heightZaxis: '50' },
    { description: 'Bottom Plate', materialGrade: 'C45/S55', unit: 'mm', heightZaxis: '70' },
    { description: 'Insulator on top and bottom plate if any', materialGrade: 'C45/S55', unit: 'mm', heightZaxis: '' },
    { description: 'QMC if Any', materialGrade: 'C45/S55', unit: 'mm', heightZaxis: '' }
  ];

}
