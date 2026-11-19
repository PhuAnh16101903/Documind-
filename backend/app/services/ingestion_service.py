import os
import hashlib
from typing import List, Dict, Any
from pypdf import PdfReader
from docx import Document as DocxDocument
import openpyxl

class IngestionService:
    @staticmethod
    def compute_sha256(file_path: str) -> str:
        """Compute SHA-256 checksum to detect duplicates and verify integrity"""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(65536), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    @staticmethod
    def parse_pdf(file_path: str) -> List[Dict[str, Any]]:
        """Parse PDF preserving exact page numbers and paragraphs"""
        chunks = []
        reader = PdfReader(file_path)
        for page_idx, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            paragraphs = [p.strip() for p in page_text.split("\n\n") if len(p.strip()) > 30]
            
            if not paragraphs and len(page_text.strip()) > 20:
                paragraphs = [page_text.strip()]

            for p in paragraphs:
                chunks.append({
                    "content": p,
                    "page_number": page_idx + 1,
                    "heading": None,
                    "sheet_name": None,
                    "cell_range": None
                })
        return chunks

    @staticmethod
    def parse_docx(file_path: str) -> List[Dict[str, Any]]:
        """Parse DOCX preserving Heading hierarchy, bullet lists and table structures"""
        import re
        chunks = []
        doc = DocxDocument(file_path)
        current_heading = "General"
        current_buffer = []

        def is_heading(text: str, style_name: str) -> bool:
            if style_name.startswith("Heading"):
                return True
            # Detect section numbers like "1.3.", "PHẦN 1", "3.1. Mục đích..."
            if re.match(r"^(PHẦN \d+|Chương \d+|\d+\.\d+\.?|\d+\. |\bMục \d+)", text) and len(text) < 140:
                return True
            return False

        for para in doc.paragraphs:
            text = para.text.strip()
            if not text:
                continue

            if is_heading(text, para.style.name):
                if current_buffer:
                    chunks.append({
                        "content": "\n".join(current_buffer),
                        "page_number": None,
                        "heading": current_heading,
                        "sheet_name": None,
                        "cell_range": None
                    })
                    current_buffer = []
                current_heading = text
                continue

            is_bullet = text.startswith(("-", "+", "•", "*", "a)", "b)", "c)", "d)"))
            current_buffer.append(text)
            joined_len = sum(len(x) for x in current_buffer)

            # Flush when reaching semantic size limit, keeping bullet lists together
            if joined_len > 700 and not text.endswith(":") and not is_bullet:
                chunks.append({
                    "content": "\n".join(current_buffer),
                    "page_number": None,
                    "heading": current_heading,
                    "sheet_name": None,
                    "cell_range": None
                })
                current_buffer = []

        if current_buffer:
            chunks.append({
                "content": "\n".join(current_buffer),
                "page_number": None,
                "heading": current_heading,
                "sheet_name": None,
                "cell_range": None
            })

        # Parse tables
        for t_idx, table in enumerate(doc.tables):
            table_rows = []
            for row in table.rows:
                row_text = " | ".join([cell.text.strip() for cell in row.cells if cell.text.strip()])
                if row_text:
                    table_rows.append(row_text)
            if table_rows:
                chunks.append({
                    "content": f"[Bảng #{t_idx + 1}]\n" + "\n".join(table_rows),
                    "page_number": None,
                    "heading": f"{current_heading} (Bảng dữ liệu)",
                    "sheet_name": None,
                    "cell_range": None
                })

        return chunks

    @staticmethod
    def parse_xlsx(file_path: str) -> List[Dict[str, Any]]:
        """Parse Excel spreadsheets by Sheet and table blocks"""
        chunks = []
        wb = openpyxl.load_workbook(file_path, data_only=True)
        for sheet_name in wb.sheetnames:
            sheet = wb[sheet_name]
            rows = list(sheet.iter_rows(values_only=True))
            if not rows:
                continue

            headers = [str(cell) for cell in rows[0] if cell is not None]
            header_str = " | ".join(headers)

            # Group rows into manageable chunks
            batch = []
            for r_idx, row in enumerate(rows[1:], start=2):
                row_vals = [str(c) if c is not None else "" for c in row]
                if any(row_vals):
                    batch.append(f"Hàng {r_idx}: " + " | ".join(row_vals))

                if len(batch) >= 10:
                    chunks.append({
                        "content": f"Sheet: {sheet_name} [Cột: {header_str}]\n" + "\n".join(batch),
                        "page_number": None,
                        "heading": None,
                        "sheet_name": sheet_name,
                        "cell_range": f"A2:End (Hàng 2-{r_idx})"
                    })
                    batch = []

            if batch:
                chunks.append({
                    "content": f"Sheet: {sheet_name} [Cột: {header_str}]\n" + "\n".join(batch),
                    "page_number": None,
                    "heading": None,
                    "sheet_name": sheet_name,
                    "cell_range": "Dữ liệu bảng"
                })
        return chunks

    @staticmethod
    def parse_text_or_markdown(file_path: str) -> List[Dict[str, Any]]:
        """Parse text and markdown files with section splitting"""
        chunks = []
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        sections = content.split("\n## ")
        for idx, sec in enumerate(sections):
            lines = sec.strip().split("\n")
            heading = lines[0].replace("#", "").strip() if idx > 0 else "Introduction"
            body = "\n".join(lines[1:] if idx > 0 else lines).strip()
            
            if len(body) > 20:
                chunks.append({
                    "content": body,
                    "page_number": None,
                    "heading": heading,
                    "sheet_name": None,
                    "cell_range": None
                })
        return chunks

    @classmethod
    def ingest_file(cls, file_path: str, file_type: str) -> List[Dict[str, Any]]:
        """Dispatcher function based on file extension"""
        ft = file_type.lower().replace(".", "")
        if ft == "pdf":
            return cls.parse_pdf(file_path)
        elif ft in ["docx", "doc"]:
            return cls.parse_docx(file_path)
        elif ft in ["xlsx", "xls"]:
            return cls.parse_xlsx(file_path)
        else:
            return cls.parse_text_or_markdown(file_path)
