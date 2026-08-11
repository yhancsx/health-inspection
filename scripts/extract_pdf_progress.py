#!/usr/bin/env python3
import fitz
import Vision
import Quartz
import os
import sys

pdf_path = "/Users/user/Desktop/종합 건강 검진 결과지.pdf"
output_file = "/Users/user/Desktop/dev/health-inspection/scratch/ocr_2026.txt"

os.makedirs("/Users/user/Desktop/dev/health-inspection/scratch", exist_ok=True)

def ocr_page(page):
    pix = page.get_pixmap(dpi=150)
    img_data = pix.tobytes('png')
    data_provider = Quartz.CGDataProviderCreateWithCFData(img_data)
    cg_image = Quartz.CGImageCreateWithPNGDataProvider(data_provider, None, False, Quartz.kCGRenderingIntentDefault)
    request = Vision.VNRecognizeTextRequest.alloc().init()
    request.setRecognitionLevel_(Vision.VNRequestTextRecognitionLevelAccurate)
    request.setRecognitionLanguages_(['ko-KR', 'en-US'])
    handler = Vision.VNImageRequestHandler.alloc().initWithCGImage_options_(cg_image, None)
    success, error = handler.performRequests_error_([request], None)
    results = []
    if success:
        for obs in request.results():
            results.append(obs.topCandidates_(1)[0].string())
    return '\n'.join(results)

print(f"Opening PDF: {pdf_path}")
doc = fitz.open(pdf_path)
total_pages = len(doc)
print(f"Total pages: {total_pages}")

with open(output_file, "w", encoding="utf-8") as f:
    for i, page in enumerate(doc):
        t = page.get_text().strip()
        if not t:
            t = ocr_page(page)
        print(f"Processed page {i+1}/{total_pages} ({len(t)} chars)")
        f.write(f"=== PAGE {i+1} ===\n{t}\n\n")
        f.flush()

print(f"OCR extraction complete! Saved to {output_file}")
