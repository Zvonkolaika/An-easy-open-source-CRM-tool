import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DealService } from '../deal.service';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChangeDetectorRef } from '@angular/core';
import { ChartConfiguration, ChartType, } from 'chart.js';
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
                const percentage = ((value / total) * 100).toFixed(0) + '%';
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
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0);
            const percentage = ((value / total) * 100).toFixed(0) + '%';
            return `${label}: ${percentage}`;
          }
        }
      },
      datalabels: {
        formatter: (value) => value.toFixed(0) + '%', // Round to 2 decimal places
        color: '#000',
      }
    }
  };

  public pieChartType: ChartType = 'pie';
  public totalActiveDeals: number = 0; 
  public totalRevenue: number = 0; 

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
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `$${value.toFixed(0)}`; 
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value) => `$${value.toFixed(0)}`, 
        color: '#000', 
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        afterDataLimits: (scale) => {
          scale.max = scale.max + 10000; // Always set max +10,000
        }
      }
    }
  };

  constructor(private dealService: DealService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadDealStatusDistribution();
  }

  async loadDealStatusDistribution() {
    const deals = await this.dealService.getDeals();
    const statusCounts = deals.reduce((acc: { [key: string]: number }, deal) => {
      if (!deal.stage) {
        console.warn('Deal with undefined stage:', deal); // Warn about deals with undefined stage
        return acc; // Skip deals with undefined stage
      }
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {});

    const totalDeals = deals.length;
    this.totalActiveDeals = totalDeals;
    this.totalRevenue = Math.round(deals.reduce((acc, deal) => acc + (typeof deal.value === 'number' ? deal.value : parseFloat(deal.value) || 0), 0));
    const labels = Object.keys(statusCounts).filter(label => label); // Filter out any undefined labels
    const data = Object.values(statusCounts).map(count => (count as number / totalDeals) * 100);

    // Define a mapping of deal stages to colors
    const stageColors: { [key: string]: string } = {
      'New': 'rgb(110, 114, 228)',
      'Discovery': 'rgb(87, 155, 252)',
      'Proposal': 'rgb(125, 212, 255)',
      'Negotiation': 'rgb(104, 212, 206)',
      'Won': 'rgb(25, 225, 142)',
      'Lost': 'rgb(223, 47, 74)'
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
        { data: revenueData, label: 'Revenue', backgroundColor: 'rgb(9, 240, 193)' } // Set the bar color
      ]
    };

    this.cdr.markForCheck(); // Manually trigger change detection
  }
}
