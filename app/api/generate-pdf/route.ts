import { NextRequest, NextResponse } from 'next/server';
import { generatePdfFromHtml } from '@/utils/generatePdf';
import { getHtmlFromData } from '@/utils/template';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    
    // Generate HTML from form data
    const html = getHtmlFromData(formData);
    
    // Convert HTML to PDF buffer
    const pdfBuffer = await generatePdfFromHtml(html);
    
    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=report.pdf',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate PDF' 
      },
      { status: 500 }
    );
  }
} 