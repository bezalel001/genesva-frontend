#!/usr/bin/env python3
"""
Import gene data from CSV file to PostgreSQL database.
"""

import csv
import sys
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from app.core.database import Base, SessionLocal, engine
from app.models.gene import Gene


def clean_csv_value(value: str) -> str | None:
    """Clean CSV value, return None for empty strings"""
    if not value or value.strip() == "":
        return None
    return value.strip()


def parse_csv_row(row: dict[str, str]) -> dict[str, Any]:
    """Parse a CSV row into gene data"""
    return {
        "ensembl": clean_csv_value(row.get("Ensembl", "")) or "",
        "gene_symbol": clean_csv_value(row.get("Gene symbol")),
        "name": clean_csv_value(row.get("Name")),
        "biotype": clean_csv_value(row.get("Biotype", "")) or "",
        "chromosome": clean_csv_value(row.get("Chromosome", "")) or "",
        "seq_region_start": int(row.get("Seq region start", 0) or 0),
        "seq_region_end": int(row.get("Seq region end", 0) or 0),
    }


def import_genes_from_csv(csv_file_path: str, batch_size: int = 1000) -> None:
    """Import genes from CSV file to database"""

    if not Path(csv_file_path).exists():
        raise FileNotFoundError(f"CSV file not found: {csv_file_path}")

    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        # Clear existing data
        print("Clearing existing gene data...")
        db.query(Gene).delete()
        db.commit()

        print(f"Reading CSV file: {csv_file_path}")

        genes_to_add = []
        total_imported = 0
        skipped_count = 0

        with open(csv_file_path, encoding="utf-8") as file:
            # Use semicolon as delimiter based on the CSV structure
            reader = csv.DictReader(file, delimiter=";")

            for row_num, row in enumerate(reader, start=2):  # Start at 2 (after header)
                try:
                    gene_data = parse_csv_row(row)

                    # Skip rows with missing essential data
                    if not gene_data["ensembl"]:
                        skipped_count += 1
                        continue

                    gene = Gene(**gene_data)
                    genes_to_add.append(gene)

                    # Batch insert for performance
                    if len(genes_to_add) >= batch_size:
                        db.add_all(genes_to_add)
                        db.commit()
                        total_imported += len(genes_to_add)
                        print(f"Imported {total_imported} genes...")
                        genes_to_add = []

                except Exception as e:
                    print(f"Error processing row {row_num}: {e}")
                    print(f"Row data: {row}")
                    skipped_count += 1
                    continue

        # Import remaining genes
        if genes_to_add:
            db.add_all(genes_to_add)
            db.commit()
            total_imported += len(genes_to_add)

        print("\n✅ Import completed!")
        print(f"   Total imported: {total_imported} genes")
        print(f"   Skipped: {skipped_count} rows")

        # Show some statistics
        total_genes = db.query(Gene).count()
        unique_chromosomes = db.query(Gene.chromosome).distinct().count()
        unique_biotypes = db.query(Gene.biotype).distinct().count()

        print("\n📊 Database Statistics:")
        print(f"   Total genes: {total_genes}")
        print(f"   Unique chromosomes: {unique_chromosomes}")
        print(f"   Unique biotypes: {unique_biotypes}")

    except Exception as e:
        db.rollback()
        print(f"❌ Import failed: {e}")
        raise
    finally:
        db.close()


def main():
    """Main function"""
    if len(sys.argv) != 2:
        print("Usage: python import_genes.py <path_to_csv_file>")
        sys.exit(1)

    csv_file_path = sys.argv[1]

    try:
        import_genes_from_csv(csv_file_path)
    except Exception as e:
        print(f"❌ Import failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
