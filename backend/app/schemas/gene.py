from pydantic import BaseModel


class GeneBase(BaseModel):
    ensembl: str
    gene_symbol: str | None = None
    name: str | None = None
    biotype: str
    chromosome: str
    seq_region_start: int
    seq_region_end: int


class Gene(GeneBase):
    id: int

    class Config:
        from_attributes = True
