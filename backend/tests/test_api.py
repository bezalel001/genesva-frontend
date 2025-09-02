"""Test gene API endpoints"""


def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "GenesVA Backend API"}


def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_get_genes_empty_database(client):
    """Test getting genes from empty database"""
    response = client.get("/api/v1/genes/")
    assert response.status_code == 200
    assert response.json() == []


def test_get_genes_with_data(client, sample_genes):
    """Test getting genes with sample data"""
    response = client.get("/api/v1/genes/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]["gene_symbol"] == "BRCA2"


def test_get_genes_with_pagination(client, sample_genes):
    """Test pagination parameters"""
    response = client.get("/api/v1/genes/?limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

    # Test skip parameter
    response = client.get("/api/v1/genes/?skip=1&limit=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1


def test_get_genes_with_filters(client, sample_genes):
    """Test filtering by chromosome and biotype"""
    # Filter by chromosome
    response = client.get("/api/v1/genes/?chromosome=17")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2  # BRCA1 and TP53 are on chromosome 17

    # Filter by biotype
    response = client.get("/api/v1/genes/?biotype=protein_coding")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3  # All sample genes are protein_coding


def test_get_gene_by_id(client, sample_genes):
    """Test getting specific gene by ID"""
    response = client.get("/api/v1/genes/1")
    assert response.status_code == 200
    data = response.json()
    assert data["gene_symbol"] == "BRCA2"
    assert data["ensembl"] == "ENSG00000139618"


def test_get_gene_by_id_not_found(client):
    """Test getting non-existent gene"""
    response = client.get("/api/v1/genes/999")
    assert response.status_code == 404
    assert "Gene not found" in response.json()["detail"]


def test_invalid_pagination_parameters(client):
    """Test invalid pagination parameters"""
    # Negative skip
    response = client.get("/api/v1/genes/?skip=-1")
    assert response.status_code == 422

    # Zero limit
    response = client.get("/api/v1/genes/?limit=0")
    assert response.status_code == 422

    # Limit too high
    response = client.get("/api/v1/genes/?limit=2000")
    assert response.status_code == 422
