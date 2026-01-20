import React, { useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Dashboard.css';

const Dashboard = () => {
  const dashboardRef = useRef(null);

  // Sample data for the chart
  const chartData = [
    { name: 'Jan', Sales: 4000, Revenue: 2400 },
    { name: 'Feb', Sales: 3000, Revenue: 1398 },
    { name: 'Mar', Sales: 2000, Revenue: 9800 },
    { name: 'Apr', Sales: 2780, Revenue: 3908 },
    { name: 'May', Sales: 1890, Revenue: 4800 },
    { name: 'Jun', Sales: 2390, Revenue: 3800 },
  ];

  const downloadPDF = async () => {
    try {
      // Create canvas from the dashboard
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      // Get canvas dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add image to PDF, creating new pages if needed
      const imgData = canvas.toDataURL('image/png');
      while (heightLeft >= 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        if (heightLeft >= 0) {
          pdf.addPage();
          position = heightLeft - imgHeight;
        }
      }

      // Download the PDF
      pdf.save('dashboard.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
      <div ref={dashboardRef} className="dashboard-content">
        <header className="dashboard-header">
          <h1>Sales Dashboard</h1>
          <p className="subtitle">Monthly Performance Report</p>
        </header>

        <section className="text-section">
          <h2>Overview</h2>
          <p>
            This dashboard provides a comprehensive overview of our sales and revenue performance
            across the first six months of the year. The data shows consistent growth in both
            sales volume and revenue streams, with notable peaks in March and strong recovery in
            May and June.
          </p>
          <p>
            Key metrics indicate a positive trend in customer acquisition and engagement. The
            revenue performance demonstrates the effectiveness of our recent marketing initiatives
            and product improvements.
          </p>
        </section>

        <section className="chart-section">
          <h2>Sales vs Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sales" fill="#8884d8" />
              <Bar dataKey="Revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="text-section">
          <h2>Key Insights</h2>
          <ul>
            <li>Sales peaked in March at 4,000 units with corresponding revenue of 9,800</li>
            <li>A dip occurred in April, but recovery was swift with strong June performance</li>
            <li>Overall trend shows 25% improvement from January to June</li>
            <li>Revenue maintains a steady upward trajectory month-over-month</li>
          </ul>
        </section>

        <footer className="dashboard-footer">
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </footer>
      </div>

      <div className="button-container">
        <button className="download-btn" onClick={downloadPDF}>
          📥 Download as PDF
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
