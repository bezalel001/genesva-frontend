from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.gene import Gene
from app.schemas.gene import Gene as GeneSchema

router = APIRouter()


@router.get("/", response_model=list[GeneSchema])
def get_genes(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    chromosome: str | None = Query(None, description="Filter by chromosome"),
    biotype: str | None = Query(None, description="Filter by biotype"),
    db: Session = Depends(get_db),
):
    """Get genes with pagination and optional filtering"""
    try:
        query = db.query(Gene)

        if chromosome:
            query = query.filter(Gene.chromosome == chromosome)

        if biotype:
            query = query.filter(Gene.biotype == biotype)

        genes = query.offset(skip).limit(limit).all()
        return genes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}") from e


@router.get("/{gene_id}", response_model=GeneSchema)
def get_gene(gene_id: int, db: Session = Depends(get_db)):
    """Get a specific gene by ID"""
    try:
        gene = db.query(Gene).filter(Gene.id == gene_id).first()
        if gene is None:
            raise HTTPException(status_code=404, detail="Gene not found")
        return gene
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}") from e


@router.get("/search/symbol/{symbol}", response_model=list[GeneSchema])
def search_genes_by_symbol(
    symbol: str,
    exact: bool = Query(False, description="Exact match instead of partial"),
    db: Session = Depends(get_db),
):
    """Search genes by symbol"""
    try:
        if not symbol.strip():
            raise HTTPException(status_code=400, detail="Symbol cannot be empty")

        query = db.query(Gene)

        if exact:
            query = query.filter(Gene.gene_symbol == symbol)
        else:
            query = query.filter(Gene.gene_symbol.ilike(f"%{symbol}%"))

        genes = query.all()
        return genes
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}") from e


@router.get("/search/ensembl/{ensembl_id}", response_model=GeneSchema)
def get_gene_by_ensembl(ensembl_id: str, db: Session = Depends(get_db)):
    """Get gene by Ensembl ID"""
    try:
        if not ensembl_id.strip():
            raise HTTPException(status_code=400, detail="Ensembl ID cannot be empty")

        gene = db.query(Gene).filter(Gene.ensembl == ensembl_id).first()
        if gene is None:
            raise HTTPException(status_code=404, detail="Gene not found")
        return gene
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}") from e


@router.get("/search/name/{name}", response_model=list[GeneSchema])
def search_genes_by_name(
    name: str,
    exact: bool = Query(False, description="Exact match instead of partial"),
    db: Session = Depends(get_db),
):
    """Search genes by name"""
    try:
        if not name.strip():
            raise HTTPException(status_code=400, detail="Name cannot be empty")

        query = db.query(Gene)

        if exact:
            query = query.filter(Gene.name == name)
        else:
            query = query.filter(Gene.name.ilike(f"%{name}%"))

        genes = query.all()
        return genes
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}") from e


@router.get("/stats/summary")
def get_gene_stats(db: Session = Depends(get_db)):
    """Get gene statistics summary"""
    try:
        total_genes = db.query(Gene).count()

        if total_genes == 0:
            return {
                "total_genes": 0,
                "chromosomes": [],
                "biotypes": [],
            }

        # Get unique chromosomes
        chromosomes = (
            db.query(Gene.chromosome).distinct().order_by(Gene.chromosome).all()
        )
        chromosome_list = [chr[0] for chr in chromosomes]

        # Get unique biotypes
        biotypes = db.query(Gene.biotype).distinct().order_by(Gene.biotype).all()
        biotype_list = [bt[0] for bt in biotypes]

        return {
            "total_genes": total_genes,
            "chromosomes": chromosome_list,
            "biotypes": biotype_list,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}") from e
