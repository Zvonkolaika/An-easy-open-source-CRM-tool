import { Component } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { DealService } from '../deal.service';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import { ChangeDetectorRef } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType,  } from 'chart.js';
import { CommonModule } from '@angular/common';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

Chart.register(ChartDataLabels);
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, BaseChartDirective, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.datasets) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i] as number;
                const total = dataset.data.reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0);
                const percentage = ((value / total) * 100).toFixed(1) + '%';
                return {
                  text: `${label}: ${percentage}`,
                  fillStyle: Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[i] : undefined,
                  hidden: isNaN(dataset.data[i] as number) || dataset.data[i] === null,
                  index: i
                };
              });
            }
            return [];
          }
        }
      }
    }
  };

public pieChartType: ChartType = 'pie';
public totalActiveDeals: number = 0; // Add this property
public totalRevenue: number = 0; // Add this property

// Add properties for the bar chart
public barChartData: ChartData<'bar'> = {
  labels: [],
  datasets: [
    { data: [], label: 'Revenue', backgroundColor: 'rgb(87, 155, 252)' } // Set the bar color
  ]
};

public barChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
  plugins: {
    legend: {
      display: false // Hide the legend
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw as number;
          return `$${value.toFixed(2)}`; // Format the value as currency
        }
      }
    },
    datalabels: {
      anchor: 'end',
      align: 'end',
      formatter: (value) => `$${value.toFixed(1)}`, // Format the value as currency
      color: '#000', // Set the color of the labels
    } 

  },
  scales: {
    x: {},
    y: {
      beginAtZero: true
    }
  }
};

  constructor(private dealService: DealService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDealStatusDistribution();
   
  }

  async loadDealStatusDistribution() {
    const deals = await this.dealService.getDeals();
    console.log('Loaded deals:', deals); // Debug log
  
    const statusCounts = deals.reduce((acc: { [key: string]: number }, deal) => {
      if (!deal.stage) {
        console.warn('Deal with undefined stage:', deal); // Warn about deals with undefined stage
        return acc; // Skip deals with undefined stage
      }
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {});
  
    console.log('Status Counts:', statusCounts); // Debug log
  
    const totalDeals = deals.length;
    this.totalActiveDeals = totalDeals;
    this.totalRevenue = deals.reduce((acc, deal) => acc + (typeof deal.value === 'number' ? deal.value : parseFloat(deal.value) || 0), 0);
    console.log('Total Revenue:', this.totalRevenue); // Debug log
  
    const labels = Object.keys(statusCounts).filter(label => label); // Filter out any undefined labels
    const data = Object.values(statusCounts).map(count => (count as number / totalDeals) * 100);
  
    console.log('Labels:', labels); // Debug log
    console.log('Data:', data); // Debug log
  
    // Define a mapping of deal stages to colors
    const stageColors: { [key: string]: string } = {
      'New': 'rgb(110, 114, 228)',
      'Negotiation': 'rgb(87, 155, 252)',
      'Won': 'rgb(125, 212, 255)',
      'Lost': 'rgb(104, 212, 206)',
      'In Progress': 'rgb(25, 225, 142)',
      'Closed': 'rgb(223, 47, 74)'
    };
  
    // Map the colors to the labels
    const backgroundColor = labels.map(label => stageColors[label] || '#000000'); // Default to black if no color is found
  
    this.pieChartData = {
      labels,
      datasets: [{
        data,
        backgroundColor
      }]
    };
  
    console.log('Pie Chart Data:', this.pieChartData); // Debug log
  
    // Calculate monthly revenue
    const monthlyRevenue = deals.reduce((acc: { [key: string]: number }, deal) => {
      const monthYear = deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'Unknown';
      acc[monthYear] = (acc[monthYear] || 0) + (typeof deal.value === 'number' ? deal.value : parseFloat(deal.value) || 0);
      return acc;
    }, {});
  
    const months = Object.keys(monthlyRevenue);
    const revenueData = Object.values(monthlyRevenue);
  
    this.barChartData = {
      labels: months,
      datasets: [
        { data: revenueData, label: 'Revenue', backgroundColor: 'rgb(112, 180, 255)' } // Set the bar color
      ]
    };
  
    console.log('Bar Chart Data:', this.barChartData); // Debug log
  
    this.cdr.markForCheck(); // Manually trigger change detection
  }
}
