"""Test configuration and fixtures"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base, get_db
from app.main import app
from app.models.gene import Gene

# Use in-memory SQLite for testing
TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


# Override the database dependency
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Create test database tables"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    """Get database session for testing"""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        # Clean up data after each test
        db.query(Gene).delete()
        db.commit()
        db.close()


@pytest.fixture
def client():
    """Get test client"""
    return TestClient(app)


@pytest.fixture
def sample_genes(db_session):
    """Create sample genes for testing"""
    genes = [
        Gene(
            ensembl="ENSG00000139618",
            gene_symbol="BRCA2",
            name="BRCA2 DNA repair associated",
            biotype="protein_coding",
            chromosome="13",
            seq_region_start=32315474,
            seq_region_end=32400266,
        ),
        Gene(
            ensembl="ENSG00000012048",
            gene_symbol="BRCA1",
            name="BRCA1 DNA repair associated",
            biotype="protein_coding",
            chromosome="17",
            seq_region_start=43044295,
            seq_region_end=43125483,
        ),
        Gene(
            ensembl="ENSG00000141510",
            gene_symbol="TP53",
            name="tumor protein p53",
            biotype="protein_coding",
            chromosome="17",
            seq_region_start=7661779,
            seq_region_end=7687550,
        ),
    ]

    for gene in genes:
        db_session.add(gene)
    db_session.commit()

    return genes
