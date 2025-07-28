/**
 * Performance Report Endpoint
 * Receives performance data from frontend for monitoring
 */

import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Store performance reports (in production, this would go to a database or monitoring service)
interface PerformanceReport {
  timestamp: number;
  summary: {
    totalMetrics: number;
    totalAlerts: number;
    errorAlerts: number;
    warningAlerts: number;
  };
  coreWebVitals: {
    LCP?: number;
    FID?: number;
    CLS?: number;
  };
  averages: {
    componentMountTime: number;
    apiResponseTime: number;
  };
  recommendations: string[];
}

let performanceReports: PerformanceReport[] = [];

// Endpoint to receive performance reports from frontend
router.post('/report', (req: Request, res: Response) => {
  try {
    const report: PerformanceReport = req.body;
    
    // Add timestamp if not present
    if (!report.timestamp) {
      report.timestamp = Date.now();
    }
    
    // Store the report (keep last 100 reports)
    performanceReports.push(report);
    if (performanceReports.length > 100) {
      performanceReports = performanceReports.slice(-100);
    }
    
    // Log critical performance issues
    if (report.summary.errorAlerts > 0) {
      console.warn(`🚨 Performance Alert: ${report.summary.errorAlerts} critical issues detected`);
    }
    
    // Log Core Web Vitals if available
    if (report.coreWebVitals.LCP && report.coreWebVitals.LCP > 4000) {
      console.warn(`🐌 Poor LCP: ${report.coreWebVitals.LCP}ms`);
    }
    
    res.json({ 
      status: 'received',
      reportId: report.timestamp,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Failed to process performance report:', error);
    res.status(400).json({ 
      error: 'Invalid performance report format',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Endpoint to get performance summary (for admin/monitoring)
router.get('/summary', (req: Request, res: Response) => {
  try {
    if (performanceReports.length === 0) {
      return res.json({
        status: 'no_data',
        message: 'No performance reports available'
      });
    }
    
    const latestReport = performanceReports[performanceReports.length - 1];
    const last24Hours = performanceReports.filter(
      report => Date.now() - report.timestamp < 24 * 60 * 60 * 1000
    );
    
    const summary = {
      latest: latestReport,
      last24Hours: {
        totalReports: last24Hours.length,
        averageLCP: last24Hours
          .filter(r => r.coreWebVitals.LCP)
          .reduce((sum, r, _, arr) => sum + (r.coreWebVitals.LCP || 0) / arr.length, 0),
        totalErrorAlerts: last24Hours.reduce((sum, r) => sum + r.summary.errorAlerts, 0),
        totalWarningAlerts: last24Hours.reduce((sum, r) => sum + r.summary.warningAlerts, 0),
        commonRecommendations: getCommonRecommendations(last24Hours)
      },
      health: getPerformanceHealth(latestReport)
    };
    
    res.json(summary);
    
  } catch (error) {
    console.error('Failed to generate performance summary:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper function to get common recommendations
function getCommonRecommendations(reports: PerformanceReport[]): { recommendation: string; frequency: number }[] {
  const recommendationCounts: { [key: string]: number } = {};
  
  reports.forEach(report => {
    report.recommendations.forEach(rec => {
      recommendationCounts[rec] = (recommendationCounts[rec] || 0) + 1;
    });
  });
  
  return Object.entries(recommendationCounts)
    .map(([recommendation, frequency]) => ({ recommendation, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5); // Top 5 recommendations
}

// Helper function to assess performance health
function getPerformanceHealth(report: PerformanceReport): string {
  if (report.summary.errorAlerts > 0) return 'critical';
  if (report.summary.warningAlerts > 5) return 'warning';
  if (report.coreWebVitals.LCP && report.coreWebVitals.LCP > 2500) return 'needs_improvement';
  return 'good';
}

export default router;