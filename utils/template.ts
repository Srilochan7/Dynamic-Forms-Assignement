export function getHtmlFromData(data: any): string {
  const timestamp = new Date().toLocaleString();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Product Submission Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #007bff;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #007bff;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          color: #666;
          margin: 10px 0 0 0;
          font-size: 14px;
        }
        .section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 4px solid #007bff;
        }
        .section h2 {
          color: #007bff;
          margin: 0 0 15px 0;
          font-size: 18px;
          font-weight: 600;
        }
        .field {
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;
        }
        .field-label {
          font-weight: 600;
          min-width: 150px;
          color: #555;
        }
        .field-value {
          flex: 1;
          color: #333;
        }
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .features-list li {
          background: #e3f2fd;
          padding: 6px 12px;
          margin: 4px 0;
          border-radius: 4px;
          display: inline-block;
          margin-right: 8px;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 12px;
        }
        .status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status.success {
          background: #d4edda;
          color: #155724;
        }
        .status.info {
          background: #d1ecf1;
          color: #0c5460;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Product Submission Report</h1>
          <p>Generated on ${timestamp}</p>
        </div>
        
        <div class="section">
          <h2>Basic Information</h2>
          <div class="field">
            <span class="field-label">Product Name:</span>
            <span class="field-value">${data.name || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Product Type:</span>
            <span class="field-value">${data.type || 'N/A'}</span>
          </div>
        </div>
        
        <div class="section">
          <h2>Power Requirements</h2>
          <div class="field">
            <span class="field-label">Battery Required:</span>
            <span class="field-value">
              <span class="status ${data.batteryNeeded ? 'success' : 'info'}">
                ${data.batteryNeeded ? 'Yes' : 'No'}
              </span>
            </span>
          </div>
          ${data.batteryNeeded && data.batteryType ? `
          <div class="field">
            <span class="field-label">Battery Type:</span>
            <span class="field-value">${data.batteryType}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="section">
          <h2>Features</h2>
          <div class="field">
            <span class="field-label">Selected Features:</span>
            <span class="field-value">
              ${data.features && data.features.length > 0 ? `
                <ul class="features-list">
                  ${data.features.map((feature: string) => `<li>${feature}</li>`).join('')}
                </ul>
              ` : '<span style="color: #999;">No features selected</span>'}
            </span>
          </div>
        </div>
        
        ${data.imageUrl ? `
        <div class="section">
          <h2>Media</h2>
          <div class="field">
            <span class="field-label">Image URL:</span>
            <span class="field-value">${data.imageUrl}</span>
          </div>
        </div>
        ` : ''}
        
        <div class="footer">
          <p>This report was automatically generated from the product submission form.</p>
          <p>Report ID: ${Date.now()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 