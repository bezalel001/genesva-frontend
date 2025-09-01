from sqlalchemy import Column, Integer, String, Text

from app.core.database import Base


class Gene(Base):
    __tablename__ = "genes"

    id = Column(Integer, primary_key=True, index=True)
    ensembl = Column(String(50), nullable=False, index=True)
    gene_symbol = Column(String(50), nullable=True, index=True)
    name = Column(Text, nullable=True)
    biotype = Column(String(50), nullable=False)
    chromosome = Column(String(10), nullable=False, index=True)
    seq_region_start = Column(Integer, nullable=False)
    seq_region_end = Column(Integer, nullable=False)
