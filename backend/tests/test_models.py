"""Test gene model and database operations"""

from app.models.gene import Gene


def test_create_gene(db_session):
    """Test creating a gene in the database"""
    gene = Gene(
        ensembl="ENSG00000000001",
        gene_symbol="TEST1",
        name="Test Gene 1",
        biotype="protein_coding",
        chromosome="1",
        seq_region_start=1000,
        seq_region_end=2000,
    )

    db_session.add(gene)
    db_session.commit()

    assert gene.id is not None
    assert gene.ensembl == "ENSG00000000001"
    assert gene.gene_symbol == "TEST1"


def test_query_gene_by_ensembl(db_session, sample_genes):
    """Test querying gene by Ensembl ID"""
    gene = db_session.query(Gene).filter(Gene.ensembl == "ENSG00000139618").first()

    assert gene is not None
    assert gene.gene_symbol == "BRCA2"
    assert gene.chromosome == "13"


def test_query_gene_by_symbol(db_session, sample_genes):
    """Test querying gene by symbol"""
    gene = db_session.query(Gene).filter(Gene.gene_symbol == "BRCA1").first()

    assert gene is not None
    assert gene.ensembl == "ENSG00000012048"
    assert gene.chromosome == "17"


def test_query_genes_by_chromosome(db_session, sample_genes):
    """Test querying genes by chromosome"""
    genes = db_session.query(Gene).filter(Gene.chromosome == "17").all()

    assert len(genes) == 2  # BRCA1 and TP53
    symbols = [gene.gene_symbol for gene in genes]
    assert "BRCA1" in symbols
    assert "TP53" in symbols


def test_gene_model_fields(sample_genes):
    """Test that gene model has all required fields"""
    gene = sample_genes[0]  # BRCA2

    # Check all fields exist
    assert hasattr(gene, "id")
    assert hasattr(gene, "ensembl")
    assert hasattr(gene, "gene_symbol")
    assert hasattr(gene, "name")
    assert hasattr(gene, "biotype")
    assert hasattr(gene, "chromosome")
    assert hasattr(gene, "seq_region_start")
    assert hasattr(gene, "seq_region_end")

    # Check field types
    assert isinstance(gene.id, int)
    assert isinstance(gene.ensembl, str)
    assert isinstance(gene.gene_symbol, str) or gene.gene_symbol is None
    assert isinstance(gene.name, str) or gene.name is None
    assert isinstance(gene.biotype, str)
    assert isinstance(gene.chromosome, str)
    assert isinstance(gene.seq_region_start, int)
    assert isinstance(gene.seq_region_end, int)


def test_gene_region_length(sample_genes):
    """Test gene region calculations"""
    gene = sample_genes[0]  # BRCA2

    length = gene.seq_region_end - gene.seq_region_start
    assert length > 0
    assert length == 84792  # BRCA2 length


def test_gene_nullable_fields(db_session):
    """Test that nullable fields can be None"""
    gene = Gene(
        ensembl="ENSG00000000002",
        gene_symbol=None,  # This should be allowed
        name=None,  # This should be allowed
        biotype="lncRNA",
        chromosome="X",
        seq_region_start=1000,
        seq_region_end=2000,
    )

    db_session.add(gene)
    db_session.commit()

    assert gene.id is not None
    assert gene.gene_symbol is None
    assert gene.name is None
