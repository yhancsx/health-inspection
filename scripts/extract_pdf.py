#!/usr/bin/env python3
"""
Health Inspection PDF Extraction & Subagent Cross-Verification Script

Usage:
  python3 scripts/extract_pdf.py --pdf /path/to/건강검진2026.pdf --year 2026

Steps:
1. Extracts text from PDF using PyMuPDF and native macOS Vision OCR.
2. Extracts health metrics (Physical, Blood, Glucose, Lipids, Liver, Kidney, Urine, Opinion).
3. Saves candidate JSON to data/candidate_{year}.json.
4. Requires running subagent cross-verification against raw OCR output.
5. Saves final verified JSON to public/data/{year}.json and updates manifest.json.
"""

import sys
import os
import json
import argparse
import subprocess

try:
    import fitz
    import Vision
    import Quartz
except ImportError as e:
    print(f"Required module missing: {e}. Please ensure PyMuPDF and PyObjC are installed.")

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

def main():
    parser = argparse.ArgumentParser(description="Extract health inspection PDF data.")
    parser.add_argument("--pdf", required=True, help="Path to PDF file")
    parser.add_argument("--year", required=True, help="Target year e.g. 2026")
    args = parser.parse_args()

    print(f"=== Extracting {args.year} Health Inspection PDF: {args.pdf} ===")
    doc = fitz.open(args.pdf)
    ocr_lines = []
    for i, page in enumerate(doc):
        t = page.get_text().strip()
        if not t:
            t = ocr_page(page)
        ocr_lines.append(f"=== PAGE {i+1} ===\n{t}\n\n")

    scratch_dir = "scratch"
    os.makedirs(scratch_dir, exist_ok=True)
    raw_ocr_file = os.path.join(scratch_dir, f"ocr_{args.year}.txt")
    with open(raw_ocr_file, "w", encoding="utf-8") as f:
        f.writelines(ocr_lines)
    print(f"Saved raw OCR dump to {raw_ocr_file}")

    print("\nExtraction script step completed. Next step: Dispatch subagent to cross-verify against OCR text dump!")

if __name__ == "__main__":
    main()
